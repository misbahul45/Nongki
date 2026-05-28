export type ApiResponse<T> = {
  status: "success" | "error"
  message: string
  data: T | null
  error: {
    code: string
    detail: unknown
  } | null
}

export function successResponse<T>(
  message: string,
  data: T,
): ApiResponse<T> {
  return {
    status: "success",
    message,
    data,
    error: null,
  }
}

export function errorResponse(
  message: string,
  code: string,
  detail: unknown = null,
): ApiResponse<null> {
  return {
    status: "error",
    message,
    data: null,
    error: { code, detail },
  }
}
