import axios from "@/config/axios-customize";

const apiGet = async (url, options = {}) => {
  const response = await axios.get(url, { ...options });
  return response.data;
};

const apiPost = async (url, data) => {
  const response = await axios.post(url, data);
  return response.data;
};

const ListeningHistoryService = {
  // Lấy tiến độ nghe gần nhất theo book_id
  getLastProgressByBook: async (bookId) => {
    return await apiGet(`/users/listening-history?book_id=${bookId}`);
  },
  // Lưu tiến độ nghe (chỉ lưu nếu chưa có)
  saveProgress: async (data) => {
    return await apiPost(`/users/listening-history/save`, data);
  },
};

export default ListeningHistoryService;
