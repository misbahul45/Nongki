export type ApiErrorItem = {
  field?: string;
  message: string;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  meta: unknown;
  errors?: ApiErrorItem[];
};

export function successResponse<T>(
  data: T,
  message = "OK",
  meta: unknown = null,
): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
    meta,
  };
}

export function errorResponse(
  message: string,
  errors?: ApiErrorItem[],
): ApiResponse<null> {
  const response: ApiResponse<null> = {
    success: false,
    message,
    meta: null,
  };

  if (errors && errors.length > 0) {
    response.errors = errors;
  }

  return response;
}
