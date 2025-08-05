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

const BookHistoryService = {
  recentlyRead: async () => {
    const response = await apiGet(`/users/reading-history`);
    return response;
  },
  getProgress: async (chapterId) => {
    const response = await apiGet(`/users/reading-history/${chapterId}`);
    return response;
  },
};

const ListeningHistoryService = {
  recentlyListened: async () => {
    const response = await apiGet(`/users/listening-history`);
    return response;
  },
  getProgress: async (chapterId) => {
    const response = await apiGet(`/users/listening-history/${chapterId}`);
    return response;
  },
};

export { BookHistoryService, ListeningHistoryService };
