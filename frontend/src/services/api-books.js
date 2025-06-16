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

const BooksService = {
  getBooks: async ({ page, per_page, sort_order, keyword }) => {
    return apiGet("/books", {
      params: { page, per_page, sort_order, keyword },
    });
  },

  bookFormat: async () => {
    return apiGet("/books/formats");
  },

  getById: async (id) => {
    return apiGet(`/books/${id}`);
  },

  create: async (data) => {
    return apiPost("/books/create", data);
  },

  update: async (id, data) => {
    return apiPost(`/books/update/${id}`, data);
  },

  destroy: async (id) => {
    return apiPost(`/books/${id}/delete`, {});
  },
};
export default BooksService;
