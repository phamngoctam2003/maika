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

const apiDelete = async (url) => {
  const response = await axios.delete(url);
  return response;
};

const BookCaseService = {
    addToBookCase: async (bookId) => {
        const response = await apiPost(`/users/book-case/add`, { book_id: bookId });
        return response;
    },
    removeFromBookCase: async (bookId) => {
        const response = await apiDelete(`/users/book-case/${bookId}`);
        return response;
    },
    getBookCase: async () => {
        const response = await apiGet(`/users/book-case`);
        return response;
    },
};
export default BookCaseService;
