// Export Axios-based API handlers (primary)
export { apiInstance } from "./axios";
export {
  handleApi,
  handleCreateApi,
  handleDeleteApi,
  handleGetApi,
} from "./handleApi";

// Export types
export type * from "../types/api";

// Export utility functions
export {
  getAuthToken,
  getCookie,
  removeCookie,
  setCookie,
} from "../utils/cookies";
