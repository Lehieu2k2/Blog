import type { AxiosResponse } from "axios";
import axios, { AxiosError } from "axios";
import { getCookie, removeCookie, setCookie } from "../utils/cookies";

// Types
interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

// Create axios instance with base configuration
const createAxiosInstance = () => {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const instance = axios.create({
    headers,
    baseURL: import.meta.env.VITE_API_URL,
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      // Don't add Authorization header for login endpoint
      if (!config.url?.includes("/auth/login")) {
        const token = getCookie("access_token");
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError) => {
      const originalConfig = error.config;

      // Don't handle token refresh for login endpoint
      if (originalConfig?.url?.includes("/auth/login")) {
        console.log(
          "Login failed:",
          error.response?.status,
          error.response?.statusText
        );
        return Promise.reject(error);
      }

      // Handle token refresh for other endpoints
      if (error.response && error.response.status === 419 && originalConfig) {
        try {
          console.log("Access token expired - attempting refresh");
          const result = await instance.post<AuthTokens>(
            "/auth/refresh-token",
            {
              refresh_token: getCookie("refresh_token"),
            }
          );

          const { access_token, refresh_token } = result.data;
          setCookie("access_token", access_token);
          setCookie("refresh_token", refresh_token);
          originalConfig.headers["Authorization"] = `Bearer ${access_token}`;

          return instance(originalConfig);
        } catch (err) {
          console.log("Token refresh failed - redirecting to login");
          const refreshError = err as AxiosError;
          if (refreshError.response && refreshError.response.status === 401) {
            removeCookie("access_token");
            removeCookie("refresh_token");
            window.location.href = "/login";
          }
          return Promise.reject(refreshError);
        }
      }

      // Handle other 401 errors (not login endpoint)
      if (error.response?.status === 401) {
        console.log("Unauthorized - redirecting to login");
        removeCookie("access_token");
        removeCookie("refresh_token");
        window.location.href = "/login";
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export const apiInstance = createAxiosInstance();
