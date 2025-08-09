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

const ChapterService = {
  getChapters: async ({book_id , page, per_page, sort_order, keyword, format_id }) => {
    return apiGet("/chapters", {
      params: { book_id, page, per_page, sort_order, keyword, format_id },
    });
  },

  getById: async (id) => {
    return apiGet(`/chapters/${id}`);
  },

  create: async (data) => {
    return apiPost("/chapters/create", data);
  },

  update: async (id, data) => {
    return apiPost(`/chapters/update/${id}`, data);
  },

  destroy: async (id) => {
    return apiPost(`/chapters/${id}/delete`, {});
  },
};
export default ChapterService;
