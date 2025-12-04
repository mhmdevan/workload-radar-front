import axios from "axios";

// In dev we rely on Vite proxy: /api -> backend.
// In prod you can override this with VITE_API_BASE_URL.
const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

export const httpClient = axios.create({
  baseURL,
  timeout: 10000,
});

// Small helper to normalize error messages coming from Axios.
export function getErrorMessage(error) {
  if (error.response && error.response.data && error.response.data.error) {
    const err = error.response.data.error;
    return err.message || err.type || "Unexpected API error";
  }

  if (error.response && typeof error.response.data === "string") {
    return error.response.data;
  }

  if (error.message) {
    return error.message;
  }

  return "Unknown error";
}
