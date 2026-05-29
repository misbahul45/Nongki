import type { FastifyInstance } from 'fastify';
import { authPlugin } from './modules/auth/auth.plugin';
import { internalRoutes } from './modules/internal/internal.route';

export async function registerRoutes(app: FastifyInstance) {
  await app.register(authPlugin, { prefix: '/auth' });
  await app.register(internalRoutes, { prefix: '/internal' });
}
