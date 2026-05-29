import type { AuthController } from "../modules/auth/auth.controller";
import type { AuthRepository } from "../modules/auth/auth.repository";
import type { AuthService } from "../modules/auth/auth.service";

declare module "fastify" {
  interface FastifyInstance {
    container: {
      authRepository: AuthRepository;
      authService: AuthService;
      authController: AuthController;
    };
  }

  interface FastifyRequest {
    user?: {
      userId: string;
      email: string;
    };
  }
}
