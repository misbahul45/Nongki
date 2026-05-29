import crypto from "node:crypto";

import { conflict, forbidden, unauthorized } from "../../lib/errors";
import { hashPassword, verifyPassword } from "../../lib/password";
import {
  generateRefreshToken,
  getRefreshTokenExpiry,
  hashRefreshToken,
  signAccessToken,
} from "../../lib/token";
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

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async register(input: RegisterInput, context: RequestContext): Promise<AuthResult> {
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

    return {
      ...this.toAuthPayload(result),
      ...tokens,
    };
  }

  async login(input: LoginInput, context: RequestContext): Promise<AuthResult> {
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

    return {
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
      ...tokens,
    };
  }

  async refresh(refreshToken: string | undefined, context: RequestContext): Promise<AuthResult> {
    if (!refreshToken) {
      throw unauthorized("Unauthorized");
    }

    const tokenHash = hashRefreshToken(refreshToken);
    const storedToken = await this.authRepository.findRefreshTokenByHash(tokenHash);

    if (!storedToken) {
      throw unauthorized("Unauthorized");
    }

    if (storedToken.revokedAt) {
      await this.authRepository.revokeRefreshTokenFamily(storedToken.familyId);
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
    const newTokenData = this.createRefreshTokenData({
      userId: storedToken.userId,
      tokenHash: hashRefreshToken(newRefreshToken),
      familyId: storedToken.familyId,
      expiresAt: getRefreshTokenExpiry(),
    }, context);
    const newStoredToken = await this.authRepository.createRefreshToken(newTokenData);

    await this.authRepository.revokeRefreshToken(storedToken.id, newStoredToken.id);

    const currentBusiness = await this.authRepository.findCurrentBusinessForUser(storedToken.userId);
    const accessToken = signAccessToken({
      sub: storedToken.user.id,
      email: storedToken.user.email,
      type: "access",
    });

    return {
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
  }

  async me(userId: string): Promise<AuthSessionPayload> {
    const user = await this.authRepository.findUserById(userId);

    if (!user) {
      throw unauthorized("Unauthorized");
    }

    if (user.status !== "active") {
      throw forbidden("User account is not active");
    }

    const currentBusiness = await this.authRepository.findCurrentBusinessForUser(user.id);

    return {
      user,
      business: currentBusiness?.business ?? null,
      member: currentBusiness
        ? {
            role: currentBusiness.role,
            status: currentBusiness.status,
          }
        : null,
    };
  }

  async logout(refreshToken: string | undefined): Promise<void> {
    if (!refreshToken) {
      return;
    }

    const storedToken = await this.authRepository.findRefreshTokenByHash(hashRefreshToken(refreshToken));

    if (storedToken && !storedToken.revokedAt) {
      await this.authRepository.revokeRefreshToken(storedToken.id);
    }
  }

  async logoutAll(userId: string): Promise<void> {
    await this.authRepository.revokeAllUserRefreshTokens(userId);
  }

  private async createSession(userId: string, email: string, context: RequestContext) {
    const accessToken = signAccessToken({
      sub: userId,
      email,
      type: "access",
    });
    const refreshToken = generateRefreshToken();

    await this.authRepository.createRefreshToken(this.createRefreshTokenData({
      userId,
      tokenHash: hashRefreshToken(refreshToken),
      familyId: crypto.randomUUID(),
      expiresAt: getRefreshTokenExpiry(),
    }, context));

    return {
      accessToken,
      refreshToken,
    };
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
