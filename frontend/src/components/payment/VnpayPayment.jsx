import React, { useState } from 'react';
import VnpayService from '@/services/vnpay/vnpay-service';
import PackageService from '@/services/users/api-package';

const VnpayPayment = ({ packageId, packageInfo }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Phương thức 1: Thanh toán package (sử dụng PackageService)
  const handlePackagePayment = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await PackageService.createVnpayPayment(packageId);
      
      if (response.data.success) {
        // Redirect tới VNPay
        VnpayService.redirectToPayment(response.data.payment_url);
      } else {
        setError(response.data.message || 'Có lỗi xảy ra');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  // Phương thức 2: Thanh toán trực tiếp (sử dụng VnpayService)
  const handleDirectPayment = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await VnpayService.createPayment(
        packageId,
        packageInfo.price,
        `Thanh toan goi ${packageInfo.name}`
      );
      
      if (response.data.success) {
        // Redirect tới VNPay
        VnpayService.redirectToPayment(response.data.payment_url);
      } else {
        setError(response.data.message || 'Có lỗi xảy ra');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vnpay-payment">
      <h3>Thanh toán gói: {packageInfo.name}</h3>
      <p>Giá: {packageInfo.price.toLocaleString()} VNĐ</p>
      
      {error && (
        <div className="error-message text-red-600 mb-4">
          {error}
        </div>
      )}
      
      <div className="payment-buttons space-y-3">
        {/* Button thanh toán package */}
        <button 
          onClick={handlePackagePayment}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Đang xử lý...' : 'Thanh toán qua VNPay (Package)'}
        </button>
        
        {/* Button thanh toán trực tiếp */}
        <button 
          onClick={handleDirectPayment}
          disabled={loading}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Đang xử lý...' : 'Thanh toán qua VNPay (Direct)'}
        </button>
      </div>
    </div>
  );
};

export default VnpayPayment;
