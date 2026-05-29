import type { ApiErrorItem } from "./response";

export class AppError extends Error {
  statusCode: number;
  errors?: ApiErrorItem[];

  constructor(message: string, statusCode = 500, errors?: ApiErrorItem[]) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;

    if (errors) {
      this.errors = errors;
    }
  }
}

export class ValidationError extends AppError {
  constructor(errors: ApiErrorItem[], message = "Validation error") {
    super(message, 400, errors);
    this.name = "ValidationError";
  }
}

export const unauthorized = (message = "Unauthorized") => new AppError(message, 401);
export const forbidden = (message = "Forbidden") => new AppError(message, 403);
export const conflict = (message = "Conflict") => new AppError(message, 409);
