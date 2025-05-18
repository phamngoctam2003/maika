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

export const callPostTag = async (id = null) => {
    const url = id ? `/getposttag/${id}` : "/getposttag";
    return apiGet(url);
};
export const callTagHot = async (id) => {
    return apiPost("/getpost/taghot", { tag_id : id });
};
export const callAllTagHot = async (id) => {
    return apiPost("/getpost/alltaghot", { tag_id : id });
};
