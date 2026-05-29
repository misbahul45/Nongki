import { env } from "../../config/env";
import type { AuthBusiness, AuthMember, AuthUser, RequestContext } from "./auth.types";
import { eventRoutingKeys } from "../../lib/events";

export const authEventNames = {
  userRegistered: eventRoutingKeys.authUserRegistered,
  userLoggedIn: eventRoutingKeys.authUserLoggedIn,
  userLoggedOut: eventRoutingKeys.authUserLoggedOut,
  refreshRotated: eventRoutingKeys.authRefreshRotated,
  refreshReplayDetected: eventRoutingKeys.authRefreshReplayDetected,
  logoutAll: "auth.logout_all",
  workspaceCreated: eventRoutingKeys.businessWorkspaceCreated,
  onboardingSeeded: eventRoutingKeys.onboardingSeeded,
  agentSettingsCreated: eventRoutingKeys.agentSettingsCreated,
  auditLogRequested: eventRoutingKeys.auditLogRequested,
} as const;

export type AuthEventName = (typeof authEventNames)[keyof typeof authEventNames];

export function createUserRegisteredEvent(
  user: AuthUser,
  business: AuthBusiness,
  member: AuthMember,
) {
  return {
    userId: user.id,
    email: user.email,
    businessId: business.id,
    businessName: business.name,
    memberRole: member.role,
  };
}

export function createUserLoggedInEvent(
  user: AuthUser,
  context: RequestContext,
  sessionFamilyId: string,
) {
  return {
    userId: user.id,
    email: user.email,
    ipAddress: eventIpAddress(context.ipAddress),
    userAgent: context.userAgent ?? null,
    sessionFamilyId,
  };
}

export function createRefreshRotatedEvent(
  user: AuthUser,
  context: RequestContext,
  familyId: string,
) {
  return {
    userId: user.id,
    familyId,
    ipAddress: eventIpAddress(context.ipAddress),
    userAgent: context.userAgent ?? null,
  };
}

export function createRefreshReplayDetectedEvent(
  userId: string,
  familyId: string,
  reason: "revoked_refresh_token_reused" | "compromised_refresh_family",
  context: RequestContext,
) {
  return {
    userId,
    familyId,
    reason,
    ipAddress: eventIpAddress(context.ipAddress),
    userAgent: context.userAgent ?? null,
  };
}

export function createUserLoggedOutEvent(
  userId: string | null,
  familyId: string | null,
  context: RequestContext,
) {
  return {
    userId,
    familyId,
    ipAddress: eventIpAddress(context.ipAddress),
    userAgent: context.userAgent ?? null,
  };
}

export function createLogoutAllEvent(userId: string, context: RequestContext) {
  return {
    userId,
    ipAddress: eventIpAddress(context.ipAddress),
    userAgent: context.userAgent ?? null,
  };
}

function eventIpAddress(ipAddress: string | undefined): string | null {
  if (!ipAddress) return null;
  if (env.AUTH_EXPOSE_RAW_IP_IN_EVENTS) return ipAddress;
  return "masked";
}
