import axios from "../config/axios-customize";

const apiPost = async (url, data) => {
  const response = await axios.post(url, data);
  return response;
};

const apiGet = async (url) => {
  const response = await axios.get(url);
  return response;
};

const AuthService = {
  register: async (data) => {
    return apiPost("/auth/register", data);
  },

  login: async (email, password) => {
    return apiPost("/auth/login", { email, password });
  },

  forgotPassword: async (email) => {
    return apiPost("/auth/forgot-password", { email });
  },

  resetPassword: async ({ email, token, password, password_confirmation }) => {
    return apiPost("/auth/reset-password", {
      email,
      token,
      password,
      password_confirmation,
    });
  },

  logout: async () => {
    try {
      const response = await apiPost("/auth/logout", {}, true);
      localStorage.removeItem("token");
      return response;
    } catch (error) {
      localStorage.removeItem("token");
      throw error.response ? error.response : error;
    }
  },

  getCurrentUser: async () => {
    return apiGet("/auth/me");
  },

  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    return token && token.trim() !== "";
  },

  Login_Google: async (accessToken) => {
    return apiPost("/auth/login-google", { access_token: accessToken });
  },

  isTokenExpired: () => {
    const token = localStorage.getItem("token");
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch (e) {
      return true;
    }
  },
};

export { AuthService };
