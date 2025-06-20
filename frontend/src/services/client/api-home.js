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
    return apiGet("/client/home/get-latest");
  },
};
export default HomeService;
