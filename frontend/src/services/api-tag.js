import axios from "../utils/axios-customize";
import Cookies from "js-cookie";
const getHeaders = () => ({
  "Content-Type": "multipart/form-data",
  Authorization: `Bearer ${Cookies.get("user-info")}`,
});

const apiPost = async (url, data) => {
  try {
    const response = await axios.post(url, data, {
      headers: getHeaders(),
    });
    return response;
  } catch (error) {
    console.error("lỗi khi gọi api, file: api", error);
    throw error;
  }
};

const apiGet = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: getHeaders(),
    });
    return response;
  } catch (error) {
    console.error("lỗi khi gọi api, file: api", error);
    throw error;
  }
};

export const callTag = async (id = null) => {
  const url = id ? `/gettag/${id}` : "/gettag";
  return apiGet(url);
};
export const destroy = async (ids) => {
  return apiPost("/gettag/delete", { ids });
};
export const create = (name) => {
  return apiPost("/gettag/create", { name });
};
export const update = (id, name) => {
  return apiPost(`/gettag/update/${id}`, { name });
};

