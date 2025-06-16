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

const CategoriesService = {
  getCategories: async ({ page, per_page, sort_order, keyword }) => {
    return apiGet("/categories", {
      params: { page, per_page, sort_order, keyword },
    });
  },

  getAll: async () => {
    return apiGet("/categories");
  },

  getCategoryById: async (id) => {
    return apiGet(`/categories/${id}`);
  },

  create: async (data) => {
    return apiPost("/categories/create", data);
  },

  update: async (id, data) => {
    return apiPost(`/categories/update/${id}`, data);
  },

  destroy: async (id) => {
    return apiPost(`/categories/${id}/delete`, {});
  },
};
export default CategoriesService ;
