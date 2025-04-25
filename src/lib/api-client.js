import axios from "axios";
import Cookies from "js-cookie";
import { HOST } from "./constants";

// Create API client with correct base URL
const apiClient = axios.create({
  baseURL: HOST,
  withCredentials: true, // Always include credentials
});

// Add request interceptor to include authorization token
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("access-token");

    // Add token to all authenticated requests
    if (
      token &&
      !config.url.includes("/login") &&
      !config.url.includes("/signup")
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Make sure URLs are consistent
    if (config.url && config.url.includes('//')) {
      // If it's an absolute URL, leave it as is
      return config;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log errors for debugging
    console.error("API Error:", error.message);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // outside of the range of 2xx
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received");
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
