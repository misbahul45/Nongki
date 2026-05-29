import type { FastifyReply, FastifyRequest } from "fastify";

import { authCookieNames, clearAuthCookies, setAuthCookies } from "../../lib/cookie";
import { unauthorized } from "../../lib/errors";
import { successResponse } from "../../lib/response";
import type { AuthService } from "./auth.service";
import { loginSchema, registerSchema } from "./auth.schema";
import type { AuthResult, AuthSessionPayload, RequestContext } from "./auth.types";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (request: FastifyRequest, reply: FastifyReply) => {
    const input = registerSchema.parse(request.body);
    const result = await this.authService.register(input, this.getRequestContext(request));

    setAuthCookies(reply, result.accessToken, result.refreshToken);

    return reply.status(201).send(successResponse(this.toResponsePayload(result), "Register success"));
  };

  login = async (request: FastifyRequest, reply: FastifyReply) => {
    const input = loginSchema.parse(request.body);
    const result = await this.authService.login(input, this.getRequestContext(request));

    setAuthCookies(reply, result.accessToken, result.refreshToken);

    return reply.send(successResponse(this.toResponsePayload(result), "Login success"));
  };

  refresh = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const result = await this.authService.refresh(
        request.cookies[authCookieNames.refresh],
        this.getRequestContext(request),
      );

      setAuthCookies(reply, result.accessToken, result.refreshToken);

      return reply.send(successResponse(this.toResponsePayload(result), "Refresh success"));
    } catch (error) {
      clearAuthCookies(reply);
      throw error;
    }
  };

  me = async (request: FastifyRequest, reply: FastifyReply) => {
    const result = await this.authService.me(this.getAuthenticatedUserId(request));

    return reply.send(successResponse(result));
  };

  logout = async (request: FastifyRequest, reply: FastifyReply) => {
    await this.authService.logout(request.cookies[authCookieNames.refresh]);
    clearAuthCookies(reply);

    return reply.send(successResponse({ success: true }, "Logout success"));
  };

  logoutAll = async (request: FastifyRequest, reply: FastifyReply) => {
    await this.authService.logoutAll(this.getAuthenticatedUserId(request));
    clearAuthCookies(reply);

    return reply.send(successResponse({ success: true }, "Logout all success"));
  };

  private toResponsePayload(result: AuthResult): AuthSessionPayload {
    return {
      user: result.user,
      business: result.business,
      member: result.member,
    };
  }

  private getRequestContext(request: FastifyRequest): RequestContext {
    const userAgentHeader = request.headers["user-agent"];
    const context: RequestContext = {
      ipAddress: request.ip,
    };

    if (typeof userAgentHeader === "string") {
      context.userAgent = userAgentHeader;
    }

    return context;
  }

  private getAuthenticatedUserId(request: FastifyRequest): string {
    if (!request.user) {
      throw unauthorized("Unauthorized");
    }

    return request.user.userId;
  }
}
