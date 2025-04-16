import axios from "axios";

const BASE_URL = "http://localhost:8080";
const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Add an interceptor to handle expired tokens
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is due to an expired access token
    if (
      error.response.status === 401 &&
      error.response.data.message === "Expired JWT" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Get the refresh token from localStorage
        const refreshToken = localStorage.getItem("refreshToken");

        // Request a new access token using the refresh token
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
          token: refreshToken,
        });

        // Save the new access token in localStorage
        localStorage.setItem("token", data.token);

        // Retry the original request with the new access token
        originalRequest.headers["Authorization"] = `Bearer ${data.token}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        console.error("Failed to refresh token:", err);
        // Redirect to login if refresh fails
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
