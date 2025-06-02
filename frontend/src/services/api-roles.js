import axios from "@/config/axios-customize.js";

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

const apiDelete = async (url, data) => {
  const response = await axios.delete(url, data);
  return response;
};

const RolesService = {
  callRoles: async ({ page, per_page, sortorder, keyword }) => {
    return apiGet("/roles", {
        params: { page, per_page, sortorder, keyword },
      });
  },
  showPermission: async () => {
    return apiGet("/roles/permissions");
  },
  showRole: async (id) => {
    return apiGet(`/roles/showrole/${id}`);
  },
  create: async (formData) => {
    return apiPost("/roles/create", formData);
  },
  destroy: async (ids) => {
    return apiPost("/roles/destroy", { ids });
  },
  update: async (formData, id) => {
    return apiPost(`/roles/update/${id}`, formData);
  },
  roleTrash: async ({ page, per_page, sortorder, keyword }) => {
    return apiGet("roles/trash", {
      params: { page, per_page, sortorder, keyword },
    });
  },
  restore: async (ids) => {
    return apiPost("/roles/restore", { ids });
  },
  forceDelete: async (id) => {
    return apiDelete(`/roles/force-delete/${id}`);
  },
};
export { RolesService };