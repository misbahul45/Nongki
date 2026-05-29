import type { FastifyReply } from "fastify";

import { env } from "../env";
import { accessTokenMaxAgeSeconds } from "./token";

const ACCESS_COOKIE_NAME = "access_token";
const REFRESH_COOKIE_NAME = "refresh_token";

type SameSite = "lax" | "strict" | "none";

function secureCookie(): boolean {
  return env.NODE_ENV === "production" || env.COOKIE_SECURE;
}

function baseCookieOptions(path: string, maxAge: number) {
  const options: {
    httpOnly: true;
    secure: boolean;
    sameSite: SameSite;
    path: string;
    maxAge: number;
    domain?: string;
  } = {
    httpOnly: true,
    secure: secureCookie(),
    sameSite: env.COOKIE_SAME_SITE,
    path,
    maxAge,
  };

  if (env.COOKIE_DOMAIN) {
    options.domain = env.COOKIE_DOMAIN;
  }

  return options;
}

export function setAuthCookies(reply: FastifyReply, accessToken: string, refreshToken: string) {
  reply.setCookie(
    ACCESS_COOKIE_NAME,
    accessToken,
    baseCookieOptions("/", accessTokenMaxAgeSeconds()),
  );

  reply.setCookie(
    REFRESH_COOKIE_NAME,
    refreshToken,
    baseCookieOptions("/api/v1/auth", env.REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60),
  );
}

export function clearAccessCookie(reply: FastifyReply) {
  reply.clearCookie(ACCESS_COOKIE_NAME, baseCookieOptions("/", 0));
}

export function clearAuthCookies(reply: FastifyReply) {
  clearAccessCookie(reply);
  reply.clearCookie(REFRESH_COOKIE_NAME, baseCookieOptions("/api/v1/auth", 0));
}

export const authCookieNames = {
  access: ACCESS_COOKIE_NAME,
  refresh: REFRESH_COOKIE_NAME,
} as const;
