import axios from "../config/axios-customize";
import Cookies from "js-cookie";
const getHeaders = () => ({
    'Content-Type': 'multipart/form-data',
    'Authorization': `Bearer ${Cookies.get('user-info')}`,
});

const apiPost = async (url, data) => {
    try {
        const response = await axios.post(url, data, {
            headers: getHeaders(),
            withCredentials: true,

        });
        return response;
    } catch (error) {
        console.log("lỗi khi gọi api, file: api",error);
        throw error;
    }
}

const apiGet = async (url) => {
    try {
        const response = await axios.get(url, {
            headers: getHeaders(),
            withCredentials: true,
        });
        return response;
    } catch (error) {
        console.log("lỗi khi gọi api, file: api",error);
        throw error;
    }
}


export const callCategory = async (id = null) => {
    const url = id ? `/getcategory/${id}` : "/getcategory";
    return apiGet(url);
};

export const createCategory = async (data) => {
    return apiPost("/createcategory", data);
};
