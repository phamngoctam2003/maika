import axios from "../utils/axios-customize";
const getHeaders = () => ({
    'Content-Type': 'multipart/form-data',
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


export const callRegister = async (data) => {
    return apiPost("/auth/register", data);
};

export const callLogin = async (email, password, ) => {
    return apiPost("/auth/login", { email, password });
};

export const calllogout = async () => {
    return apiPost("/auth/logout");
};

export const callCategory = async (id = null) => {
    const url = id ? `/getcategory/${id}` : "/getcategory";
    return apiGet(url);
};

export const callNAV = async () => {
    return apiGet("callnav");
};

export const destroy = async (ids) => {
    return apiPost("/getcategory/delete", { ids });
};

export const create = (name, description) => {
    return apiPost("/getcategory/create", { name, description });
};

export const update = (id, name, description) => {
    return apiPost(`/getcategory/update/${id}`, { name, description });
};

export const checkAuth = async () => {
    return apiGet("/auth/me");
};