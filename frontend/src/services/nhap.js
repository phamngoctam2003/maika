import axios from "../utils/axios-customize";
import Cookies from "js-cookie";

const getHeaders = () => ({
    'Content-Type': 'multipart/form-data',
    'Authorization': `Bearer ${Cookies.get('user-info')}`,
    withCredentials: true,
});
console.log(Cookies.get('user-info'));
const apiPost = async (url, data) => {
    try {
        const response = await axios.post(url, data, {
            headers: getHeaders(),
            withCredentials: true,
        });
        return response;
    } catch (error) {
        console.error("API POST error:", error);
        throw error;
    }
};

const apiGet = async (url) => {
    try {
        const response = await axios.get(url, {
            headers: getHeaders(),
            withCredentials: true
        });
        return response;
    } catch (error) {
        console.error("API GET error:", error);
        throw error;
    }
};

export const callPost = async (id = null) => {
    const url = id ? `/getpost/${id}` : "/getpost";
    return apiGet(url);
};

export const destroy = async (ids) => {
    return apiPost("/getpost/delete", { ids });
};

export const create = async (formData) => {
    return apiPost("/getpost/create", formData);
};

export const update = async (formData, id) => {
    return apiPost(`/getpost/update/${id}`, formData);
};
