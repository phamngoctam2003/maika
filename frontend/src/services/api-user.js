import axios from "../config/axios-customize.js";

const apiPost = async (url, data) => {
  const response = await axios.post(url, data);
  return response;
};

const apiDelete = async (url, data) => {
  const response = await axios.delete(url, data);
  return response;
}

const apiGet = async (url, options = {}) => {
  const response = await axios.get(url, {
    ...options,
  });
  return response;
};
const UsersService = {
  getAllUsers: async ({ page, per_page, sortorder, keyword }) => {
    return apiGet("/accounts", {
      params: { page, per_page, sortorder, keyword },
    });
  },
  getUserLimit: async () => {
    return apiGet("/accounts/getuserlimit");
  },
  getUserCount: async () => {
    return apiGet("/accounts/get-user-count");
  },
  create: async (formData) => {
    return apiPost("/accounts/create", formData);
  },
  upadteStatus: async (data) => {
    return apiPost("/accounts/updatestatus", data);
  },
  roleLevel: async (formdata, id) => {
    return apiPost(`/accounts/rolelevel/${id}`, formdata);
  },
  updateUser: async (formdata, id) => {
    return apiPost(`/accounts/update/${id}`, formdata);
  },
  showRoles: async () => {
    return apiGet("/accounts/showroles");
  },
  destroy: async (ids) => {
    return apiPost('/accounts/destroy', { ids });
  },
  getUserById: async (id) => {
    return apiGet(`/accounts/getbyid/${id}`);
  },
  userTrash: async ({ page, per_page, sortorder, keyword }) => {
      return apiGet('accounts/trash', {
          params: { page, per_page, sortorder, keyword},
      });
  },
  restore: async (ids) => {
      return apiPost("/accounts/restore", { ids });
  },
  forceDelete: async (id) => {
      return apiDelete(`/accounts/force-delete/${id}`);
  },
};
export { UsersService };