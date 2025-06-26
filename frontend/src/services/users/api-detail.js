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
};
export default DetailService;
