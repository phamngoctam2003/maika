import axios from "@/config/axios-customize";

const apiPost = async (url, data) => {
  const response = await axios.post(url, data);
  return response;
};

const apiDelete = async (url, data) => {
  const response = await axios.delete(url, data);
  return response;
};

const apiGet = async (url, options = {}) => {
  const response = await axios.get(url, {
    ...options,
  });
  return response;
};

const PaymentService = {
  getPayments: async ({ page, per_page, sort_order, keyword }) => {
    return apiGet("/payments", {
      params: { page, per_page, sort_order, keyword },
    });
  },

  getAll: async () => {
    return apiGet("/payments");
  },

  getById: async (id) => {
    return apiGet(`/payments/getbyid/${id}`);
  },

  create: async (data) => {
    return apiPost("/payments/create", data);
  },

  update: async (id, data) => {
    return apiPost(`/payments/update/${id}`, data);
  },

  destroy: async (id) => {
    return apiPost(`/payments/${id}/delete`, {});
  },
};
export default PaymentService;
