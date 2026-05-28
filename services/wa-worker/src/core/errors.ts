export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public detail: unknown = null,
  ) {
    super(message)
    this.name = "AppError"
  }
}
