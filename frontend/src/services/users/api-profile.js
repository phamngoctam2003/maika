import axios from "@/config/axios-customize";

const apiPost = async (url, data) => {
  const response = await axios.post(url, data);
  return response;
};

const apiGet = async (url, options = {}) => {
  const response = await axios.get(url, {
    ...options,
  });
  return response;
};

const ProfileService = {
  updateUserProfile: async (data) => {
    const response = await apiPost('/users/profile', data);
    return response;
  },
  changePassword: async (data) => {
    const response = await apiPost('/auth/change-password', data);
    return response;
  },
};

export default ProfileService;