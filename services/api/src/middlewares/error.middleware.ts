// Global error handling middleware
import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";

import { AppError } from "../lib/errors";
import { errorResponse } from "../lib/response";

export function errorHandler(
  error: FastifyError | Error,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  request.log.error(error);

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send(errorResponse(error.message, error.errors));
  }

  if (error instanceof ZodError) {
    return reply.status(400).send(
      errorResponse(
        "Validation error",
        error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      ),
    );
  }

  return reply.status(500).send(errorResponse("Internal server error"));
}
