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

const DetailService = {
  getEbookReader: async (slug) => {
    return apiGet(`/users/detail/get-ebook-reader/${slug}`);
  },

  getEbook: async (slug) => {
    return apiGet(`/users/detail/get-ebook/${slug}`);
  },

  getComments: async (bookId, page = 1, perPage = 10) => {
    return apiGet(`/users/book-comments?book_id=${bookId}&page=${page}&per_page=${perPage}`);
  },
  
  create: async (data) => {
    return apiPost(`/users/book-comments/create`, data);
  },

  checkUserComment: async (bookId) => {
    return apiPost(`/users/book-comments/check-user-comment`, { book_id: bookId });
  }
};
export default DetailService;
