import type { FastifyInstance } from 'fastify';
import { authRoutes } from './modules/auth/auth.route';

export async function registerRoutes(app: FastifyInstance) {
  await app.register(authRoutes, { prefix: '/auth' });
}
