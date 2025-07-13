import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button, Card, Result, Spin, Typography, Descriptions } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import PackageService from '@/services/users/api-package';

const { Title, Text } = Typography;

const PaymentResult = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [paymentResult, setPaymentResult] = useState(null);
    const [orderInfo, setOrderInfo] = useState(null);

    useEffect(() => {
        checkPaymentResult();
    }, []);

    const checkPaymentResult = async () => {
        try {
            // Lấy thông tin từ URL params
            const orderId = searchParams.get('order_id');
            const transactionId = searchParams.get('transaction_id');
            const amount = searchParams.get('amount');
            const error = searchParams.get('error');

            // Lấy thông tin đơn hàng từ localStorage
            const pendingOrder = JSON.parse(localStorage.getItem('pending_order') || '{}');

            if (error) {
                // Thanh toán thất bại
                setPaymentResult({
                    success: false,
                    message: error,
                    data: null
                });
                setLoading(false);
                return;
            }

            if (orderId) {
                // Kiểm tra trạng thái thanh toán từ server
                const response = await PackageService.checkPaymentStatus(orderId);
                
                if (response.success) {
                    setPaymentResult({
                        success: true,
                        message: 'Thanh toán thành công',
                        data: {
                            order_id: orderId,
                            transaction_id: transactionId,
                            amount: amount,
                            ...response.data
                        }
                    });
                    setOrderInfo(pendingOrder);
                    
                    // Xóa thông tin đơn hàng tạm thời
                    localStorage.removeItem('pending_order');
                } else {
                    setPaymentResult({
                        success: false,
                        message: response.message || 'Không thể xác thực thanh toán',
                        data: null
                    });
                }
            } else {
                setPaymentResult({
                    success: false,
                    message: 'Không tìm thấy thông tin thanh toán',
                    data: null
                });
            }
        } catch (error) {
            console.error('Error checking payment result:', error);
            setPaymentResult({
                success: false,
                message: 'Lỗi khi kiểm tra kết quả thanh toán',
                data: null
            });
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const handleBackToPackages = () => {
        navigate('/package-plan');
    };

    const handleGoHome = () => {
        navigate('/');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spin size="large" />
                <div className="ml-4">
                    <Text>Đang kiểm tra kết quả thanh toán...</Text>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <Card className="shadow-lg">
                    {paymentResult?.success ? (
                        <Result
                            icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                            status="success"
                            title={
                                <Title level={2} className="text-green-600">
                                    Thanh toán thành công!
                                </Title>
                            }
                            subTitle={
                                <div className="space-y-2">
                                    <Text className="text-gray-600">
                                        Cảm ơn bạn đã mua gói hội viên. Gói của bạn đã được kích hoạt thành công.
                                    </Text>
                                </div>
                            }
                            extra={
                                <div className="space-y-4">
                                    {/* Thông tin thanh toán */}
                                    <Card size="small" className="bg-green-50 border-green-200">
                                        <Title level={4} className="text-green-700 mb-4">
                                            Thông tin thanh toán
                                        </Title>
                                        <Descriptions column={1} size="small">
                                            <Descriptions.Item label="Mã đơn hàng">
                                                <Text strong>{paymentResult.data.order_id}</Text>
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Mã giao dịch">
                                                <Text strong>{paymentResult.data.transaction_id}</Text>
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Số tiền">
                                                <Text strong className="text-green-600">
                                                    {formatCurrency(paymentResult.data.amount)}
                                                </Text>
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Gói hội viên">
                                                <Text strong>{paymentResult.data.package?.name}</Text>
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Thời gian thanh toán">
                                                <Text>
                                                    {paymentResult.data.payment_at 
                                                        ? new Date(paymentResult.data.payment_at).toLocaleString('vi-VN')
                                                        : 'Vừa xong'
                                                    }
                                                </Text>
                                            </Descriptions.Item>
                                        </Descriptions>
                                    </Card>

                                    {/* Buttons */}
                                    <div className="flex gap-4 justify-center">
                                        <Button 
                                            type="primary" 
                                            size="large"
                                            onClick={handleGoHome}
                                        >
                                            Về trang chủ
                                        </Button>
                                        <Button 
                                            size="large"
                                            onClick={handleBackToPackages}
                                        >
                                            Xem gói hội viên
                                        </Button>
                                    </div>
                                </div>
                            }
                        />
                    ) : (
                        <Result
                            icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
                            status="error"
                            title={
                                <Title level={2} className="text-red-600">
                                    Thanh toán thất bại
                                </Title>
                            }
                            subTitle={
                                <div className="space-y-2">
                                    <Text className="text-gray-600">
                                        {paymentResult?.message || 'Đã xảy ra lỗi trong quá trình thanh toán'}
                                    </Text>
                                </div>
                            }
                            extra={
                                <div className="space-y-4">
                                    {/* Thông tin đơn hàng nếu có */}
                                    {orderInfo && (
                                        <Card size="small" className="bg-red-50 border-red-200">
                                            <Title level={4} className="text-red-700 mb-4">
                                                Thông tin đơn hàng
                                            </Title>
                                            <Descriptions column={1} size="small">
                                                <Descriptions.Item label="Mã đơn hàng">
                                                    <Text strong>{orderInfo.order_id}</Text>
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Số tiền">
                                                    <Text strong>
                                                        {formatCurrency(orderInfo.amount)}
                                                    </Text>
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Thời gian tạo">
                                                    <Text>
                                                        {new Date(orderInfo.created_at).toLocaleString('vi-VN')}
                                                    </Text>
                                                </Descriptions.Item>
                                            </Descriptions>
                                        </Card>
                                    )}

                                    {/* Buttons */}
                                    <div className="flex gap-4 justify-center">
                                        <Button 
                                            type="primary" 
                                            size="large"
                                            onClick={handleBackToPackages}
                                        >
                                            Thử lại
                                        </Button>
                                        <Button 
                                            size="large"
                                            onClick={handleGoHome}
                                        >
                                            Về trang chủ
                                        </Button>
                                    </div>
                                </div>
                            }
                        />
                    )}
                </Card>
            </div>
        </div>
    );
};

export default PaymentResult;
