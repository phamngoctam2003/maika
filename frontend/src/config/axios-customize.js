import axios from "axios";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const instance = axios.create({
  baseURL: baseUrl,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Xử lý đặc biệt cho multipart/form-data
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
instance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    
    // Bỏ qua nếu không phải lỗi từ server hoặc đã retry
    if (!error.response || originalRequest._retry) {
      return Promise.reject(error);
    }

    const { status } = error.response;
    
    // Xử lý 401/403
    if (status === 401 || status === 403) {
      // Kiểm tra xem có phải lỗi về quyền truy cập sách không
      const errorCode = error.response?.data?.error_code;
      
      // Debug logging
      console.log('Axios interceptor - 401/403 error:', {
        status,
        errorCode,
        url: originalRequest.url,
        data: error.response?.data
      });
      
      // Nếu là lỗi quyền truy cập sách, không cần refresh token
      if (errorCode === 'MEMBERSHIP_REQUIRED' || errorCode === 'LOGIN_REQUIRED') {
        console.log('Axios interceptor - Book access error, skip refresh token');
        return Promise.reject(error);
      }
      
      // Nếu đã thử refresh rồi, không thử lại
      if (originalRequest._retry) {
        console.log('Axios interceptor - Already retried, reject');
        return Promise.reject(error);
      }
      
      console.log('Axios interceptor - Attempting token refresh');
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");
        
        // Gọi refresh token
        const { data } = await axios.post(`${baseUrl}/auth/refresh`, {
          refresh_token: refreshToken
        });
        
        localStorage.setItem("token", data.access_token);
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        
        return instance(originalRequest);
      } catch (refreshError) {
        // Xóa token và chuyển hướng khi refresh thất bại
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default instance;