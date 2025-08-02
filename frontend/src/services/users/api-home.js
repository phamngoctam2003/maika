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

const HomeService = {
  getLatets: async () => {
    const response = await apiGet("/users/home/get-latest");
    return response; // Trả về data thay vì toàn bộ response
  },

  // API cho book ranking
  getRankingBooks: async () => {
    const response = await apiGet("/users/home/get-ranking");
    return response;
  },

  // API cho proposed books
  getProposedBooks: async () => {
    const response = await apiGet("/users/home/get-proposed");
    return response;
  },

  // API lấy sách theo danh mục
  getBooksByCategory: async (categorySlug, limit = 12) => {
    const response = await apiGet(
      `/users/home/get-books-by-category/${categorySlug}?limit=${limit}`
    );
    return response;
  },

  getBooksCategory: async (limit = 5) => {
    const response = await apiGet(
      `/users/home/get-category-book?limit=${limit}`
    );
    return response;
  },

  // API lấy danh sách categories cho sách điện tử
  getEbookCategories: async () => {
    const response = await apiGet("/users/ebook/get-all-ebook-category");
    return response;
  },

  // API lấy danh sách categories cho sách nói
  getAudiobookCategories: async () => {
    const response = await apiGet(
      "/users/audiobook/get-all-audiobook-category"
    );
    return response;
  },

  // API lấy danh sách tất cả categories (fallback)
  getCategories: async () => {
    const response = await apiGet("/categories");
    return response;
  },

  getBookFree: async ({
    page,
    per_page,
    sortorder,
    format,
    filter_category,
  }) => {
    return apiGet("/users/home/get-book-free", {
      params: { page, per_page, sortorder, format, filter_category },
    });
  },

  getBookMember: async ({
    page,
    per_page,
    sortorder,
    format,
    filter_category,
  }) => {
    return apiGet("/users/home/get-book-member", {
      params: { page, per_page, sortorder, format, filter_category },
    });
  },
};
export default HomeService;
