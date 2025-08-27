// Cookie utility functions
export const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null; // SSR safety

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookiePart = parts.pop();
    return cookiePart ? cookiePart.split(";").shift() || null : null;
  }
  return null;
};

// Safe cookie getter with fallback
export const getAuthToken = (): string | null => {
  return getCookie("access_token") || getCookie("authToken");
};

export const setCookie = (
  name: string,
  value: string,
  days: number = 7
): void => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

export const removeCookie = (name: string): void => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};
