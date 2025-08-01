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

const AudioBookService = {
  getLatets: async () => {
    const response = await apiGet("/users/audiobook/get-latest");
    return response; 
  },

  // API cho book ranking
  getRankingBooks: async () => {
    const response = await apiGet("/users/audiobook/get-ranking");
    return response;
  },

  // API cho proposed books  
  getProposedBooks: async () => {
    const response = await apiGet("/users/audiobook/get-proposed");
    return response;
  },

  // API lấy sách theo danh mục
  getAudioByCategory: async (categorySlug, limit = 12) => {
    const response = await apiGet(`/users/home/get-books-by-category/${categorySlug}?limit=${limit}`);
    return response;
  },

  // API lấy sách theo danh mục với pagination
  getAudioByCategoryPaginated: async (categorySlug, page = 1, limit = 24) => {
    const response = await apiGet(`/users/audiobook/getcategory/${categorySlug}?page=${page}&limit=${limit}`);
    return response;
  },

  // API lấy danh sách categories cho sách nói
  getAudioCategories: async (limit = 5) => {
    const response = await apiGet(`/users/audiobook?limit=${limit}`);
    return response;
  },


  // API lấy danh sách tất cả categories (fallback)
  getCategories: async () => {
    const response = await apiGet("/categories");
    return response;
  },


};
export default AudioBookService;
