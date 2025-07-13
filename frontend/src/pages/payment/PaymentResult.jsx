import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Spin, Result } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import VnpayService from '@/services/vnpay/vnpay-service';

const PaymentResult = () => {
    const [loading, setLoading] = useState(true);
    const [paymentResult, setPaymentResult] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        handlePaymentResult();
    }, [location]);

    const handlePaymentResult = async () => {
        try {
            // Lấy parameters từ URL
            const params = VnpayService.handlePaymentResult();
            console.log('VNPay callback params:', params);

            // Kiểm tra kết quả thanh toán
            const isSuccess = VnpayService.isPaymentSuccess(params);
            const message = VnpayService.getPaymentErrorMessage(params.vnp_ResponseCode);

            // Lấy thông tin order từ localStorage
            const pendingOrder = JSON.parse(localStorage.getItem('pending_order') || '{}');

            setPaymentResult({
                success: isSuccess,
                message: message,
                order_id: params.vnp_TxnRef,
                amount: params.vnp_Amount ? parseInt(params.vnp_Amount) / 100 : 0,
                transaction_id: params.vnp_TransactionNo,
                bank_code: params.vnp_BankCode,
                response_code: params.vnp_ResponseCode,
                package_id: pendingOrder.package_id,
                raw_params: params
            });

            // Xóa pending order khỏi localStorage
            localStorage.removeItem('pending_order');

            // TODO: Gửi kết quả về server để cập nhật trạng thái đơn hàng
            // await updateOrderStatus(params);

        } catch (error) {
            console.error('Error handling payment result:', error);
            setPaymentResult({
                success: false,
                message: 'Có lỗi xảy ra khi xử lý kết quả thanh toán',
                error: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    const handleReturnToPackages = () => {
        navigate('/package-plan');
    };

    const handleReturnToHome = () => {
        navigate('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-center">
                    <Spin size="large" />
                    <p className="text-white mt-4">Đang xử lý kết quả thanh toán...</p>
                </div>
            </div>
        );
    }

    if (!paymentResult) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <Result
                    status="error"
                    title="Không thể xử lý kết quả thanh toán"
                    subTitle="Vui lòng liên hệ hỗ trợ khách hàng"
                    extra={[
                        <button
                            key="home"
                            onClick={handleReturnToHome}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
                        >
                            Về trang chủ
                        </button>
                    ]}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                    {/* Header */}
                    <div className="text-center mb-8">
                        {paymentResult.success ? (
                            <CheckCircleOutlined className="text-6xl text-green-400 mb-4" />
                        ) : (
                            <CloseCircleOutlined className="text-6xl text-red-400 mb-4" />
                        )}
                        
                        <h1 className={`text-3xl font-bold mb-2 ${
                            paymentResult.success ? 'text-green-400' : 'text-red-400'
                        }`}>
                            {paymentResult.success ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
                        </h1>
                        
                        <p className="text-gray-300 text-lg">
                            {paymentResult.message}
                        </p>
                    </div>

                    {/* Payment Details */}
                    <div className="bg-gray-700 rounded-xl p-6 mb-6">
                        <h3 className="text-white text-xl font-semibold mb-4">Chi tiết giao dịch</h3>
                        
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Mã đơn hàng:</span>
                                <span className="text-white font-mono">{paymentResult.order_id}</span>
                            </div>
                            
                            <div className="flex justify-between">
                                <span className="text-gray-400">Số tiền:</span>
                                <span className="text-white font-semibold">
                                    {paymentResult.amount.toLocaleString()} VNĐ
                                </span>
                            </div>
                            
                            {paymentResult.transaction_id && (
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Mã giao dịch:</span>
                                    <span className="text-white font-mono">{paymentResult.transaction_id}</span>
                                </div>
                            )}
                            
                            {paymentResult.bank_code && (
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Ngân hàng:</span>
                                    <span className="text-white">{paymentResult.bank_code}</span>
                                </div>
                            )}
                            
                            <div className="flex justify-between">
                                <span className="text-gray-400">Mã phản hồi:</span>
                                <span className="text-white font-mono">{paymentResult.response_code}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {paymentResult.success ? (
                            <>
                                <button
                                    onClick={handleReturnToHome}
                                    className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                                >
                                    Về trang chủ
                                </button>
                                <button
                                    onClick={handleReturnToPackages}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                                >
                                    Xem gói khác
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={handleReturnToPackages}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                                >
                                    Thử lại
                                </button>
                                <button
                                    onClick={handleReturnToHome}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                                >
                                    Về trang chủ
                                </button>
                            </>
                        )}
                    </div>

                    {/* Debug info in development */}
                    {process.env.NODE_ENV === 'development' && (
                        <div className="mt-6 p-4 bg-gray-600 rounded-lg">
                            <h4 className="text-white font-semibold mb-2">Debug Info:</h4>
                            <pre className="text-xs text-gray-300 overflow-auto">
                                {JSON.stringify(paymentResult.raw_params, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentResult;
