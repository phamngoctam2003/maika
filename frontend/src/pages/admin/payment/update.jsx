import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { AntNotification } from "@components/global/notification";
import PaymentService from "@/services/api-payment";
import Breadcrumb from "@components/admin/breadcrumb";
import { Loading } from "@components/loading/loading";
import { Select } from "antd";

const Update_Payment = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [payment, setPayment] = useState(null);
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState("");
    const breadcrumbItems = [
        { label: "Quản Trị", path: "/admin" },
        { label: "Quản Lý Thanh Toán", path: "/admin/payment" },
        { label: "Cập Nhật Thanh Toán", path: null },
    ];

    useEffect(() => {
        const fetchPayment = async () => {
            setLoading(true);
            try {
                const res = await PaymentService.getById(id);
                if (res) {
                    setPayment(res);
                    setStatus(res.status || "");
                    setPaymentStatus(res.payment_status || "");
                } else {
                    AntNotification.showNotification("Có lỗi xảy ra", "Không thể tải dữ liệu thanh toán!", "error");
                }
            } catch (error) {
                AntNotification.handleError(error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchPayment();
    }, [id]);


    const handleStatusChange = (value) => {
        setStatus(value);
    };
    const handlePaymentStatusChange = (value) => {
        setPaymentStatus(value);
    };

    const handSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await PaymentService.update(id, { status, payment_status: paymentStatus });
            if (res) {
                AntNotification.showNotification("Cập nhật thành công", "Trạng thái thanh toán đã được cập nhật!", "success");
                navigate("/admin/payments");
            } else {
                AntNotification.showNotification("Có lỗi xảy ra", "Cập nhật trạng thái thất bại!", "error");
            }
        } catch (error) {
            AntNotification.handleError(error);
        }
    };

    return (
        <div className="pt-16 px-4 lg:ml-64">
            <Breadcrumb items={breadcrumbItems} />
            <div className="bg-white shadow rounded-lg mb-4 p-4 h-full">
                <div className="flex justify-between items-center my-2">
                    <h5 className="text-xl font-medium leading-tight text-primary">
                        Cập Nhật Trạng Thái Thanh Toán
                    </h5>
                </div>
                <form className="max-w-lg mt-5" onSubmit={handSubmit}>
                    <div className="mb-5">
                        <label htmlFor="publication_year" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tên gói cước</label>
                        <input
                            disabled
                            type="text"
                            value={payment?.package?.name || ""}
                            style={{ borderRadius: '4px', padding: '11px' }}
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="publication_year" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Giá</label>
                        <input
                            type="text"
                            disabled
                            value={
                                payment
                                    ? `${new Intl.NumberFormat('vi-VN', { currency: 'VND' }).format(payment?.amount || 0)} đ`
                                    : ""
                            }
                            style={{ borderRadius: '4px', padding: '11px' }}
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Trạng thái gói cước</label>
                        <Select
                            style={{
                                height: '44px',
                                minHeight: '44px',
                            }}
                            name="status"
                            className="w-full"
                            placeholder="Chọn trạng thái"
                            value={status}
                            onChange={handleStatusChange}
                            options={[
                                { value: "pending", label: "Chờ xử lý" },
                                { value: "active", label: "Hoạt động" },
                                { value: "expired", label: "Hết hạn" },
                                { value: "cancelled", label: "Đã hủy" }
                            ]}
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Trạng thái thanh toán</label>
                        <Select
                            style={{
                                height: '44px',
                                minHeight: '44px',
                            }}
                            name="payment_status"
                            className="w-full"
                            placeholder="Chọn trạng thái"
                            value={paymentStatus}
                            onChange={handlePaymentStatusChange}
                            options={[
                                { value: "pending", label: "Chờ xử lý" },
                                { value: "completed", label: "Hoàn thành" },
                                { value: "cancelled", label: "Đã hủy" },
                                { value: "failed", label: "Thất bại" }
                            ]}
                        />
                    </div>
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Cập nhật trạng thái</button>
                </form>
                <Loading isLoading={loading} />
            </div>
        </div>
    );
}

export default Update_Payment;