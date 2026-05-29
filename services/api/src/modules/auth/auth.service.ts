import crypto from "node:crypto";

import { env } from "../../config/env";
import type { EventBus } from "../../lib/event-bus";
import { conflict, forbidden, unauthorized } from "../../lib/errors";
import { hashPassword, verifyPassword } from "../../lib/password";
import type { RateLimiter } from "../../lib/rate-limit";
import type { RedisStore } from "../../lib/redis";
import {
  accessTokenMaxAgeSeconds,
  generateRefreshToken,
  getRefreshTokenExpiry,
  hashRefreshToken,
  signAccessToken,
  verifyAccessToken,
} from "../../lib/token";
import {
  authEventNames,
  createLogoutAllEvent,
  createRefreshReplayDetectedEvent,
  createRefreshRotatedEvent,
  createUserLoggedInEvent,
  createUserLoggedOutEvent,
  createUserRegisteredEvent,
} from "./auth.events";
import type { AuthRepository } from "./auth.repository";
import type { CreateRefreshTokenData } from "./auth.repository";
import type {
  AuthResult,
  AuthSessionPayload,
  LoginInput,
  RegisterInput,
  RequestContext,
} from "./auth.types";

const invalidCredentials = unauthorized("Invalid email or password");

type AuthServiceDependencies = {
  authRepository: AuthRepository;
  eventBus: EventBus;
  rateLimiter: RateLimiter;
  redis: RedisStore;
};

export class AuthService {
  constructor(private readonly deps: AuthServiceDependencies) {}

  async register(input: RegisterInput, context: RequestContext): Promise<AuthResult> {
    await this.rateLimitRegister(input, context);

    const existingUser = await this.authRepository.findUserByEmail(input.email);

    if (existingUser) {
      throw conflict("Email already registered");
    }

    const passwordHash = await hashPassword(input.password);
    const slug = await this.generateUniqueBusinessSlug(input.businessName);

    const result = await this.authRepository.createRegisterWorkspaceTransaction({
      user: {
        name: input.name,
        email: input.email,
        passwordHash,
      },
      business: {
        name: input.businessName,
        slug,
        type: input.businessType,
      },
    });

    const tokens = await this.createSession(result.user.id, result.user.email, context);
    const authResult = {
      ...this.toAuthPayload(result),
      ...tokens,
    };

    await this.publishAfterCommit(authEventNames.userRegistered, createUserRegisteredEvent(
      result.user,
      result.business,
      result.member,
    ), context, result.user.id, result.business.id);
    await this.publishAfterCommit(authEventNames.workspaceCreated, {
      businessId: result.business.id,
      businessName: result.business.name,
      ownerUserId: result.user.id,
    }, context, result.user.id, result.business.id);
    await this.publishAfterCommit(authEventNames.onboardingSeeded, {
      businessId: result.business.id,
    }, context, result.user.id, result.business.id);
    await this.publishAfterCommit(authEventNames.agentSettingsCreated, {
      businessId: result.business.id,
    }, context, result.user.id, result.business.id);
    await this.publishAudit("REGISTER_SUCCESS", result.user.id, result.business.id, context);

    return authResult;
  }

  async login(input: LoginInput, context: RequestContext): Promise<AuthResult> {
    await this.rateLimitLogin(input, context);

    const user = await this.authRepository.findUserByEmail(input.email);

    if (!user) {
      throw invalidCredentials;
    }

    const passwordValid = await verifyPassword(input.password, user.passwordHash);

    if (!passwordValid) {
      throw invalidCredentials;
    }

    if (user.status !== "active") {
      throw forbidden("User account is not active");
    }

    await this.authRepository.updateLastLoginAt(user.id);

    const currentBusiness = await this.authRepository.findCurrentBusinessForUser(user.id);
    const tokens = await this.createSession(user.id, user.email, context);
    const authResult = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        status: user.status,
      },
      business: currentBusiness?.business ?? null,
      member: currentBusiness
        ? {
            role: currentBusiness.role,
            status: currentBusiness.status,
          }
        : null,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };

    await this.publishAfterCommit(
      authEventNames.userLoggedIn,
      createUserLoggedInEvent(authResult.user, context, tokens.familyId),
      context,
      user.id,
      currentBusiness?.business.id ?? null,
    );
    await this.publishAudit("LOGIN_SUCCESS", user.id, currentBusiness?.business.id ?? null, context);

    return authResult;
  }

  async refresh(refreshToken: string | undefined, context: RequestContext): Promise<AuthResult> {
    await this.rateLimitRefresh(refreshToken, context);

    if (!refreshToken) {
      throw unauthorized("Unauthorized");
    }

    const tokenHash = hashRefreshToken(refreshToken);
    const storedToken = await this.authRepository.findRefreshTokenByHash(tokenHash);

    if (!storedToken) {
      throw unauthorized("Unauthorized");
    }

    if (await this.isRefreshFamilyCompromised(storedToken.familyId)) {
      await this.authRepository.revokeRefreshTokenFamily(storedToken.familyId);
      await this.publishReplayDetected(
        storedToken.userId,
        storedToken.familyId,
        "compromised_refresh_family",
        context,
      );
      throw unauthorized("Unauthorized");
    }

    if (storedToken.revokedAt) {
      await this.markRefreshFamilyCompromised(storedToken.familyId);
      await this.authRepository.revokeRefreshTokenFamily(storedToken.familyId);
      await this.publishReplayDetected(
        storedToken.userId,
        storedToken.familyId,
        "revoked_refresh_token_reused",
        context,
      );
      throw unauthorized("Unauthorized");
    }

    if (storedToken.expiresAt.getTime() <= Date.now()) {
      await this.authRepository.revokeRefreshToken(storedToken.id);
      throw unauthorized("Unauthorized");
    }

    if (storedToken.user.status !== "active") {
      await this.authRepository.revokeRefreshTokenFamily(storedToken.familyId);
      throw forbidden("User account is not active");
    }

    const newRefreshToken = generateRefreshToken();
    await this.authRepository.rotateRefreshToken(
      storedToken.id,
      this.createRefreshTokenData({
        userId: storedToken.userId,
        tokenHash: hashRefreshToken(newRefreshToken),
        familyId: storedToken.familyId,
        expiresAt: getRefreshTokenExpiry(),
      }, context),
    );

    const currentBusiness = await this.authRepository.findCurrentBusinessForUser(storedToken.userId);
    const accessToken = this.signAccessToken(storedToken.user.id, storedToken.user.email);
    const result = {
      user: storedToken.user,
      business: currentBusiness?.business ?? null,
      member: currentBusiness
        ? {
            role: currentBusiness.role,
            status: currentBusiness.status,
          }
        : null,
      accessToken,
      refreshToken: newRefreshToken,
    };

    await this.publishAfterCommit(
      authEventNames.refreshRotated,
      createRefreshRotatedEvent(storedToken.user, context, storedToken.familyId),
      context,
      storedToken.userId,
      currentBusiness?.business.id ?? null,
    );
    await this.publishAudit("REFRESH_ROTATED", storedToken.userId, currentBusiness?.business.id ?? null, context);

    return result;
  }

  async me(userId: string): Promise<AuthSessionPayload> {
    const cacheKey = `auth:me:${userId}`;
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached) as AuthSessionPayload;
    }

    const user = await this.authRepository.findUserById(userId);

    if (!user) {
      throw unauthorized("Unauthorized");
    }

    if (user.status !== "active") {
      throw forbidden("User account is not active");
    }

    const currentBusiness = await this.authRepository.findCurrentBusinessForUser(user.id);
    const payload = {
      user,
      business: currentBusiness?.business ?? null,
      member: currentBusiness
        ? {
            role: currentBusiness.role,
            status: currentBusiness.status,
          }
        : null,
    };

    await this.safeRedisSet(cacheKey, JSON.stringify(payload), env.AUTH_ME_CACHE_TTL_SECONDS);

    return payload;
  }

  async logout(refreshToken: string | undefined, accessToken: string | undefined, context: RequestContext): Promise<void> {
    await this.rateLimiter.consume(`rate:auth:logout:ip:${context.ipAddress ?? "unknown"}`, 60, 15 * 60);

    let userId: string | null = null;
    let familyId: string | null = null;

    if (accessToken) {
      try {
        const payload = verifyAccessToken(accessToken);
        userId = payload.sub;
        await this.safeRedisSet(
          `auth:access-denylist:${payload.jti}`,
          "true",
          accessTokenMaxAgeSeconds(),
        );
      } catch {
        userId = null;
      }
    }

    if (refreshToken) {
      const storedToken = await this.authRepository.findRefreshTokenByHash(hashRefreshToken(refreshToken));

      if (storedToken && !storedToken.revokedAt) {
        userId = storedToken.userId;
        familyId = storedToken.familyId;
        await this.authRepository.revokeRefreshToken(storedToken.id);
      }
    }

    if (userId) {
      await this.redis.del(`auth:me:${userId}`).catch(() => undefined);
    }

    await this.publishAfterCommit(
      authEventNames.userLoggedOut,
      createUserLoggedOutEvent(userId, familyId, context),
      context,
      userId,
      null,
    );

    if (userId) {
      await this.publishAudit("LOGOUT", userId, null, context);
    }
  }

  async logoutAll(userId: string, accessToken: string | undefined, context: RequestContext): Promise<void> {
    await this.rateLimiter.consume(`rate:auth:logout-all:ip:${context.ipAddress ?? "unknown"}`, 30, 15 * 60);
    await this.authRepository.revokeAllUserRefreshTokens(userId);
    await this.redis.del(`auth:me:${userId}`).catch(() => undefined);

    if (accessToken) {
      try {
        const payload = verifyAccessToken(accessToken);
        await this.safeRedisSet(
          `auth:access-denylist:${payload.jti}`,
          "true",
          accessTokenMaxAgeSeconds(),
        );
      } catch {
        // The refresh-token family revocation above remains the source of truth.
      }
    }

    await this.publishAfterCommit(
      authEventNames.logoutAll,
      createLogoutAllEvent(userId, context),
      context,
      userId,
      null,
    );
    await this.publishAudit("LOGOUT_ALL", userId, null, context);
  }

  private get authRepository() {
    return this.deps.authRepository;
  }

  private get eventBus() {
    return this.deps.eventBus;
  }

  private get rateLimiter() {
    return this.deps.rateLimiter;
  }

  private get redis() {
    return this.deps.redis;
  }

  private async createSession(userId: string, email: string, context: RequestContext) {
    const refreshToken = generateRefreshToken();
    const familyId = crypto.randomUUID();
    const accessToken = this.signAccessToken(userId, email);

    await this.authRepository.createRefreshToken(this.createRefreshTokenData({
      userId,
      tokenHash: hashRefreshToken(refreshToken),
      familyId,
      expiresAt: getRefreshTokenExpiry(),
    }, context));

    return {
      accessToken,
      refreshToken,
      familyId,
    };
  }

  private signAccessToken(userId: string, email: string) {
    return signAccessToken({
      sub: userId,
      email,
      type: "access",
      jti: crypto.randomUUID(),
    });
  }

  private async rateLimitLogin(input: LoginInput, context: RequestContext) {
    await this.rateLimiter.consume(`rate:auth:login:ip:${context.ipAddress ?? "unknown"}`, env.AUTH_LOGIN_IP_LIMIT, 15 * 60);
    await this.rateLimiter.consume(`rate:auth:login:email:${input.email.toLowerCase()}`, env.AUTH_LOGIN_EMAIL_LIMIT, 15 * 60);
  }

  private async rateLimitRegister(input: RegisterInput, context: RequestContext) {
    await this.rateLimiter.consume(`rate:auth:register:ip:${context.ipAddress ?? "unknown"}`, env.AUTH_REGISTER_IP_LIMIT, 60 * 60);
    await this.rateLimiter.consume(`rate:auth:register:email:${input.email.toLowerCase()}`, env.AUTH_REGISTER_EMAIL_LIMIT, 60 * 60);
  }

  private async rateLimitRefresh(refreshToken: string | undefined, context: RequestContext) {
    await this.rateLimiter.consume(`rate:auth:refresh:ip:${context.ipAddress ?? "unknown"}`, env.AUTH_REFRESH_IP_LIMIT, 15 * 60);

    if (refreshToken) {
      await this.rateLimiter.consume(`rate:auth:refresh:token:${hashRefreshToken(refreshToken).slice(0, 16)}`, 20, 15 * 60);
    }
  }

  private async isRefreshFamilyCompromised(familyId: string): Promise<boolean> {
    return (await this.redis.get(`auth:refresh-family-compromised:${familyId}`)) === "true";
  }

  private async markRefreshFamilyCompromised(familyId: string): Promise<void> {
    const expiresAt = await this.authRepository.findRefreshTokenFamilyMaxExpiry(familyId);
    const fallbackTtl = env.REFRESH_FAMILY_COMPROMISED_TTL_DAYS * 24 * 60 * 60;
    const ttlSeconds = expiresAt
      ? Math.max(1, Math.ceil((expiresAt.expiresAt.getTime() - Date.now()) / 1000))
      : fallbackTtl;

    await this.safeRedisSet(`auth:refresh-family-compromised:${familyId}`, "true", ttlSeconds);
  }

  private async publishReplayDetected(
    userId: string,
    familyId: string,
    reason: "revoked_refresh_token_reused" | "compromised_refresh_family",
    context: RequestContext,
  ) {
    await this.publishAfterCommit(
      authEventNames.refreshReplayDetected,
      createRefreshReplayDetectedEvent(userId, familyId, reason, context),
      context,
      userId,
      null,
    );
    await this.publishAudit("REFRESH_REPLAY_DETECTED", userId, null, context);
  }

  private async publishAudit(
    action: string,
    userId: string | null,
    businessId: string | null,
    context: RequestContext,
  ) {
    await this.publishAfterCommit(authEventNames.auditLogRequested, {
      action,
      entityType: "auth",
      userId,
      businessId,
      ipAddress: this.eventIpAddress(context.ipAddress),
      userAgent: context.userAgent ?? null,
    }, context, userId, businessId);
  }

  private async publishAfterCommit(
    eventName: string,
    payload: Record<string, unknown>,
    context: RequestContext,
    userId: string | null,
    businessId: string | null,
  ) {
    try {
      const options: Parameters<EventBus["publish"]>[3] = {
        actor: userId ? { type: "user", id: userId } : { type: "system", id: null },
        tenant: { businessId },
      };

      if (context.correlationId) {
        options.correlationId = context.correlationId;
      }

      await this.eventBus.publish(eventName, eventName, payload, options);
    } catch (error) {
      console.error("Auth event publish failed", {
        eventName,
        correlationId: context.correlationId,
        error,
      });
      // TODO: upgrade to an outbox table for guaranteed post-commit delivery.
    }
  }

  private eventIpAddress(ipAddress: string | undefined): string | null {
    if (!ipAddress) return null;
    return env.AUTH_EXPOSE_RAW_IP_IN_EVENTS ? ipAddress : "masked";
  }

  private async safeRedisSet(key: string, value: string, ttlSeconds: number): Promise<void> {
    await this.redis.set(key, value, ttlSeconds).catch(() => undefined);
  }

  private async generateUniqueBusinessSlug(name: string): Promise<string> {
    const baseSlug = slugify(name);
    let candidate = baseSlug;
    let attempts = 0;

    while (await this.authRepository.findBusinessBySlug(candidate)) {
      attempts += 1;
      candidate = `${baseSlug}-${crypto.randomBytes(3).toString("hex")}`;

      if (attempts > 5) {
        candidate = `${baseSlug}-${crypto.randomUUID()}`;
        break;
      }
    }

    return candidate;
  }

  private createRefreshTokenData(
    data: Omit<CreateRefreshTokenData, "userAgent" | "ipAddress">,
    context: RequestContext,
  ): CreateRefreshTokenData {
    const tokenData: CreateRefreshTokenData = { ...data };

    if (context.userAgent) {
      tokenData.userAgent = context.userAgent;
    }

    if (context.ipAddress) {
      tokenData.ipAddress = context.ipAddress;
    }

    return tokenData;
  }

  private toAuthPayload(payload: AuthSessionPayload): AuthSessionPayload {
    return {
      user: payload.user,
      business: payload.business,
      member: payload.member,
    };
  }
}

function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || `business-${crypto.randomBytes(3).toString("hex")}`;
}
