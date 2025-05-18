import axios from "axios";
const baseUrl = import.meta.env.VITE_BACKEND_URL;
const instance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
//  dữ liệu phản hồi từ server sẽ được xử lý ở đây
instance.interceptors.response.use(
  function (response) {
    return response && response.data ? response.data : response;
  },
  async function (error) {
    const originalRequest = error.config;

    if (error.response) {
      const { status } = error.response;
      if ((status === 401 && !originalRequest._retry) || status === 403) {
        originalRequest._retry = true;
        try {
          // Gọi API refresh token
          const refreshToken = localStorage.getItem("refreshToken");
          if (!refreshToken) throw new Error("No refresh token available");
          const refreshTokenResponse = await axios.post(
            `${baseUrl}/auth/refresh`,
            { refresh_token: refreshToken }
          );
          const { access_token } = refreshTokenResponse.data;
          localStorage.setItem("token", access_token);
          originalRequest.headers.Authorization = `Bearer ${access_token}`;

          if (status === 403) {
            window.location.href = "/";
          }

          return instance(originalRequest); // Gửi lại request ban đầu
        } catch (refreshError) {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);
export default instance;
