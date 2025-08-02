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

const PackageService = {
  // Lấy danh sách gói hội viên
  getPackage: async () => {
    const response = await apiGet("/users/package");
    return response;
  },
  // Lấy lịch sử giao dịch
  getTransactionHistories: async () => {
    const response = await apiGet("/transaction-histories");
    return response;
  },

  // Phương thức cũ - mua gói trực tiếp (không qua VNPay)
  setUserPackage: async (packageId) => {
    const response = await apiPost("/users/package/purchase", { package_id: packageId });
    return response;
  },

  // Phương thức mới - tạo thanh toán VNPay (Updated API)
  createVnpayPayment: async (packageId, returnUrl = null) => {
    const data = {
      package_id: packageId,
      order_id: `package_${packageId}_${Date.now()}`, // Tạo order_id duy nhất
    };
    
    // Thêm return_url nếu có
    if (returnUrl) {
      data.return_url = returnUrl;
    }
    
    const response = await apiPost("/vnpay/create-payment", data);
    return response;
  },

  // Kiểm tra trạng thái thanh toán
  checkPaymentStatus: async (orderId) => {
    const response = await apiGet(`/payment/status?order_id=${orderId}`);
    return response;
  },

  // Kiểm tra cấu hình VNPay
  checkVnpayConfig: async () => {
    const response = await apiGet("/vnpay/check-config");
    return response;
  },

};
export default PackageService;
