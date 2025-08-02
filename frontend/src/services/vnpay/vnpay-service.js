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

const VnpayService = {
  // Tạo thanh toán VNPay với order_id và amount
  createPayment: async (orderId, amount, orderInfo = null) => {
    const data = {
      order_id: orderId,
      amount: amount,
      order_info: orderInfo || `Thanh toan don hang #${orderId}`,
    };
    
    const response = await apiPost("/vnpay/create-payment", data);
    return response;
  },

  // Tạo thanh toán VNPay với thông tin chi tiết
  createPaymentWithDetails: async (options) => {
    const response = await apiPost("/vnpay/create-payment", options);
    return response;
  },

  // Kiểm tra cấu hình VNPay
  checkConfig: async () => {
    const response = await apiGet("/vnpay/check-config");
    return response;
  },

  // Debug hash generation (chỉ dùng trong development)
  debugHash: async (data) => {
    const response = await apiPost("/vnpay/debug-hash", data);
    return response;
  },

  // Redirect tới VNPay
  redirectToPayment: (paymentUrl) => {
    window.location.href = paymentUrl;
  },

  // Xử lý kết quả thanh toán từ URL parameters
  handlePaymentResult: () => {
    const urlParams = new URLSearchParams(window.location.search);
    const result = {};
    
    // Lấy tất cả parameters từ URL
    for (const [key, value] of urlParams.entries()) {
      result[key] = value;
    }
    
    return result;
  },

  // Kiểm tra thanh toán thành công
  isPaymentSuccess: (params) => {
    return params.vnp_ResponseCode === '00';
  },

  // Xử lý kết quả trả về từ VNPay
  vnpReturn: async (paymentData) => {
    try {
      const response = await axios.post("/vnpay/return", paymentData);
      return response;
    } catch (error) {
      console.error("VNPay return error:", error);
      throw error;
    }
  },

  // Lấy thông tin lỗi thanh toán
  getPaymentErrorMessage: (responseCode) => {
    const errorMessages = {
      '00': 'Giao dịch thành công',
      '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
      '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
      '10': 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
      '11': 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
      '12': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
      '13': 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP).',
      '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
      '51': 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
      '65': 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
      '75': 'Ngân hàng thanh toán đang bảo trì.',
      '79': 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định.',
      '99': 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)'
    };

    return errorMessages[responseCode] || 'Lỗi không xác định';
  },
};

export default VnpayService;
