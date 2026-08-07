export interface ApiBaseResponse {
  success: boolean;
  message: string;
}

export interface ApiResponse<T>
  extends ApiBaseResponse {
  data: T;
}

export interface ApiError {
  status?: number;
  data?: ApiBaseResponse;
}