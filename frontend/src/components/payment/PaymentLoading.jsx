import { useEffect, useState } from 'react';
import { Spin, Card, Typography, Progress } from 'antd';

const { Title, Text } = Typography;

const PaymentLoading = () => {
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        'Đang xác thực thông tin...',
        'Đang tạo đơn hàng...',
        'Đang kết nối VNPay...',
        'Đang chuyển hướng...'
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev < 90) {
                    return prev + 10;
                }
                return prev;
            });
        }, 300);

        const stepInterval = setInterval(() => {
            setCurrentStep(prev => {
                if (prev < steps.length - 1) {
                    return prev + 1;
                }
                return prev;
            });
        }, 1000);

        return () => {
            clearInterval(interval);
            clearInterval(stepInterval);
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-96 text-center">
                <div className="space-y-6">
                    <div>
                        <Spin size="large" />
                        <Title level={3} className="mt-4 text-blue-600">
                            Đang xử lý thanh toán
                        </Title>
                    </div>
                    
                    <Progress 
                        percent={progress} 
                        strokeColor={{
                            '0%': '#108ee9',
                            '100%': '#87d068',
                        }}
                        showInfo={false}
                    />
                    
                    <div className="space-y-2">
                        <Text className="text-gray-600">
                            {steps[currentStep]}
                        </Text>
                        <Text className="text-xs text-gray-400 block">
                            Vui lòng không tắt trình duyệt
                        </Text>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default PaymentLoading;
