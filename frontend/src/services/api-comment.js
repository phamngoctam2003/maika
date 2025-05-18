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
export const update = (id, content) => {
  return apiPost(`/comments/update/${id}`, { content });
};

export const destroy = async (ids) => {
    return apiPost("/comments/delete", { ids });
};

export const callComments = async (params) => {
    return apiGet("/comments/", params);
};
export const getComment = async (id) => {
    return apiGet(`/comments/getcomment/${id}`);
};
export const updateStatus = async (data) => {
  return apiPost("/comments/updatestatus", data);
};
export const countComments = async () => {
  return apiGet("/comments/countcomments");
};
