// API Response Types
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status?: number;
  success?: boolean;
}

// Generic types for common data structures
export interface PaginatedResponse<T = unknown> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
// Error types
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

// Generic request body type
export type RequestBody =
  | Record<string, unknown>
  | FormData
  | object
  | null
  | undefined;

// Content type options
export type ContentType = "json" | "form-data" | "url-encoded";

// Generic response data type
export type ResponseData =
  | Record<string, unknown>
  | unknown[]
  | string
  | number
  | boolean
  | null;

// Enhanced API options
export interface ApiOptions {
  contentType?: ContentType;
  redirect?: boolean; // Auto redirect on 401
  retryOnTokenRefresh?: boolean;
}

// Standard error response format
export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}

// Auth types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user?: {
    id: string;
    username: string;
    email?: string;
  };
}
