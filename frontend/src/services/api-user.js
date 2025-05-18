import axios from "../utils/axios-customize";
import Cookies from "js-cookie";
const getHeaders = () => ({
    'Content-Type': 'multipart/form-data',
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

export const callUsers = async () => {
    return apiGet("/users");
};

export const getAccount = async (data) => {
    return apiPost("/getaccount", data);
};
export const destroy = async (ids) => {
    return apiPost("/users/delete", { ids });
};

export const updateStatus = async (data) => {
    return apiPost("/users/updatestatus", data);
};


export const updateRole = async (data) => {
    return apiPost("/users/updaterole", data);
};
export const updatePassword = async (data) => {
    return apiPost("/changepassword", data);
};
export const updateAccount = async (formData) => {
    return apiPost(`/updateaccount`, formData);
};