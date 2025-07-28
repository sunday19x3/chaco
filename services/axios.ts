import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Create a custom axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  // Enable cookies to be sent with requests
  // withCredentials: true,
})

// Request interceptor to attach the token to each request
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Get token from localStorage
    const token =
      localStorage.getItem("access-token") ||
      localStorage.getItem("temp-token");

    // If token exists, attach it to the Authorization header
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Response interceptor (optional)
axiosInstance.interceptors.response.use(
  (response) => {
    // Any status code within the range of 2xx triggers this function
    return response;
  },
  (error) => {
    // Handle specific error cases
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx

      // Handle 401 Unauthorized - token expired or invalid
      if (error.response.status === 401) {
        // Clear token from localStorage
        localStorage.removeItem("access-token");
        localStorage.removeItem("temp-token");
        // You might want to redirect to login page or dispatch a logout action
        window.location.href = "/dang-nhap";
      }
    }

    return Promise.reject(error);
  }
);

export const checkErrorMessage = (response: any) => {
  if (response.data.message == "error") {
    throw new Error(
      response?.data?.errors?.vi ||
        (
          Object.values(response.data.errors).find(
            (error: any) => error.vi
          ) as any
        )?.vi ||
        "Đã có lỗi xảy ra. Vui lòng thử lại."
    );
  }
};
export default axiosInstance;
