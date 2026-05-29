import crypto from "node:crypto";
import jwt from "jsonwebtoken";

import { env } from "../env";
import { unauthorized } from "./errors";
import type { AccessTokenPayload } from "../modules/auth/auth.types";

type JwtPayload = jwt.JwtPayload & {
  sub?: string;
  email?: string;
  type?: string;
};

export function signAccessToken(payload: AccessTokenPayload): string {
  const options: jwt.SignOptions = {
    subject: payload.sub,
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as NonNullable<jwt.SignOptions["expiresIn"]>,
  };

  return jwt.sign(
    {
      email: payload.email,
      type: "access",
    },
    env.JWT_ACCESS_SECRET as jwt.Secret,
    options,
  );
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;

    if (!payload.sub || !payload.email || payload.type !== "access") {
      throw unauthorized("Unauthorized");
    }

    return {
      sub: payload.sub,
      email: payload.email,
      type: "access",
    };
  } catch {
    throw unauthorized("Unauthorized");
  }
}

export function generateRefreshToken(): string {
  return crypto.randomBytes(48).toString("base64url");
}

export function hashRefreshToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function getRefreshTokenExpiry(): Date {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + env.REFRESH_TOKEN_EXPIRES_DAYS);
  return expiresAt;
}

export function accessTokenMaxAgeSeconds(): number {
  const match = /^(\d+)([smhd])$/.exec(env.JWT_ACCESS_EXPIRES_IN);

  if (!match) {
    return 15 * 60;
  }

  const value = Number(match[1]);
  const unit = match[2];

  if (unit === "s") return value;
  if (unit === "m") return value * 60;
  if (unit === "h") return value * 60 * 60;
  return value * 24 * 60 * 60;
}
