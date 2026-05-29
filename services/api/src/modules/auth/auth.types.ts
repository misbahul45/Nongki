import type {
  BusinessStatus,
  BusinessType,
  MemberRole,
  MemberStatus,
  UserStatus,
} from "@prisma/client";

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  businessName: string;
  businessType: BusinessType;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RequestContext = {
  requestId?: string;
  correlationId?: string;
  userAgent?: string;
  ipAddress?: string;
  idempotencyKey?: string;
};

export type AccessTokenPayload = {
  sub: string;
  email: string;
  type: "access";
  jti: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  avatarUrl: string | null;
};

export type AuthBusiness = {
  id: string;
  name: string;
  type: BusinessType;
  status: BusinessStatus;
  slug: string;
};

export type AuthMember = {
  role: MemberRole;
  status: MemberStatus;
};

export type AuthSessionPayload = {
  user: AuthUser;
  business: AuthBusiness | null;
  member: AuthMember | null;
};

export type AuthResult = AuthSessionPayload & {
  accessToken: string;
  refreshToken: string;
};
