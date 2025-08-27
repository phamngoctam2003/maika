import axios from "@/config/axios-customize";

const apiPost = async (url, data) => {
  const response = await axios.post(url, data);
  return response;
};

const apiDelete = async (url, data) => {
  const response = await axios.delete(url, data);
  return response;
};

const apiGet = async (url, options = {}) => {
  const response = await axios.get(url, {
    ...options,
  });
  return response;
};

const PackageService = {
  getPackages: async ({ page, per_page, sort_order, keyword }) => {
    return apiGet("/packages", {
      params: { page, per_page, sort_order, keyword },
    });
  },


  getById: async (id) => {
    return apiGet(`/packages/${id}`);
  },

  create: async (data) => {
    return apiPost("/packages/create", data);
  },

  update: async (id, data) => {
    return apiPost(`/packages/update/${id}`, data);
  },

  destroy: async (ids) => {
    return apiPost(`/packages/delete`, { ids });
  },
};
export default PackageService;
