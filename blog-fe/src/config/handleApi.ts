import type { AxiosResponse, ResponseType } from "axios";
import type { ContentType, RequestBody, ResponseData } from "../types/api";
import { apiInstance } from "./axios";

// Universal API handler - inspired by Next.js handleCreateApi pattern
export const handleApi = async <T = ResponseData>(
  url: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    data?: RequestBody;
    responseType?: ResponseType;
    contentType?: ContentType;
  } = {}
): Promise<AxiosResponse<T>> => {
  const {
    method = "GET",
    data = null,
    responseType = "json",
    contentType = "json",
  } = options;

  // Prepare headers based on content type - similar to Next.js pattern
  const headers: Record<string, string> = {};

  // Only set Content-Type for methods that send data
  if (["POST", "PUT", "PATCH"].includes(method) && data) {
    if (
      contentType === "json" &&
      data &&
      typeof data === "object" &&
      !(data instanceof FormData)
    ) {
      headers["Content-Type"] = "application/json";
    } else if (contentType === "url-encoded") {
      headers["Content-Type"] = "application/x-www-form-urlencoded";
    }
    // FormData sets its own Content-Type automatically
  }

  return apiInstance.request<T>({
    method,
    url,
    data: ["POST", "PUT", "PATCH"].includes(method) ? data : undefined,
    responseType,
    headers,
  });
};

// Convenience methods that use the universal handler
export const handleGetApi = async <T = ResponseData>(
  url: string,
  responseType: ResponseType = "json"
): Promise<AxiosResponse<T>> => {
  return handleApi<T>(url, { method: "GET", responseType });
};

// export const apiPost = async <T = ResponseData>(
//   url: string,
//   data?: RequestBody,
//   options: {
//     responseType?: ResponseType;
//     contentType?: ContentType;
//   } = {}
// ): Promise<AxiosResponse<T>> => {
//   return handleApi<T>(url, {
//     method: "POST",
//     data,
//     ...options,
//   });
// };

// export const apiPut = async <T = ResponseData>(
//   url: string,
//   data?: RequestBody,
//   options: {
//     responseType?: ResponseType;
//     contentType?: ContentType;
//   } = {}
// ): Promise<AxiosResponse<T>> => {
//   return handleApi<T>(url, {
//     method: "PUT",
//     data,
//     ...options,
//   });
// };

// export const apiPatch = async <T = ResponseData>(
//   url: string,
//   data?: RequestBody,
//   options: {
//     responseType?: ResponseType;
//     contentType?: ContentType;
//   } = {}
// ): Promise<AxiosResponse<T>> => {
//   return handleApi<T>(url, {
//     method: "PATCH",
//     data,
//     ...options,
//   });
// };

export const handleDeleteApi = async <T = ResponseData>(
  url: string,
  responseType: ResponseType = "json"
): Promise<AxiosResponse<T>> => {
  return handleApi<T>(url, { method: "DELETE", responseType });
};

// handleCreateApi pattern - exactly like Next.js for compatibility
export const handleCreateApi = async <T = ResponseData>({
  data,
  url,
  method = "POST",
  type = "json",
}: {
  data?: RequestBody;
  url: string;
  method?: "POST" | "PUT" | "PATCH";
  type?: "json" | "form";
}): Promise<T> => {
  const contentType = type === "json" ? "json" : "form-data";
  const response = await handleApi<T>(url, {
    method,
    data,
    contentType,
  });

  return response.data;
};
