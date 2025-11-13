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

const BannerService = {
  getBanners: async ({ page, per_page, sort_order, keyword }) => {
    return apiGet("/banners", {
      params: { page, per_page, sort_order, keyword },
    });
  },

  create: async (data) => {
    return apiPost("/banners/create", data);
  },

  update: async (id, data) => {
    return apiPost(`/banners/update/${id}`, data);
  },

  destroy: async (ids) => {
    return apiPost('/banners/destroy', {ids});
  },
};
export default BannerService;
