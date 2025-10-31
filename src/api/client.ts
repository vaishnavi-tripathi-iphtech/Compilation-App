import axios from 'axios';
import { store } from '../store';
import { refreshAccessToken } from '../store/authSlice';

// A mock API base URL
const API_BASE_URL = 'https://api.mock.myapp.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// --- Request Interceptor ---
// This runs BEFORE each request is sent
apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = store.getState().auth;
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response Interceptor ---
// This runs on every response that comes back from the API
apiClient.interceptors.response.use(
  (response) => response, // For successful responses, just pass them through
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is 401 Unauthorized and we haven't already retried
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark that we've retried once

      try {
        // Dispatch the refresh token thunk
        await store.dispatch(refreshAccessToken()).unwrap();
        
        // The store is now updated with the new accessToken.
        // We can re-run the original request which will now use the new token.
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If the refresh itself fails, we reject the promise.
        // This could trigger a logout action elsewhere.
        return Promise.reject(refreshError);
      }
    }
    // For any other errors, just reject
    return Promise.reject(error);
  }
);

export default apiClient;