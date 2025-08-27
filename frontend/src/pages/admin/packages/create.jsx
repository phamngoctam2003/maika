import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AntNotification } from "@components/global/notification";
import Breadcrumb from "@components/admin/breadcrumb";
import PackageService from "@/services/api-package";

const CreatePackage = () => {
    const navigate = useNavigate();
    const [formValues, setFormValues] = useState({
        name: "",
        duration_months: "",
        original_price: "",
        discounted_price: "",
        discount_percent: "",
        highlight_label: "",
        is_best_offer: false,
    });

    const breadcrumbItems = [
        { label: "Quản Trị", path: "/admin" },
        { label: "Quản Lý Gói Cước", path: "/admin/packages" },
        { label: "Thêm Gói Cước", path: null },
    ];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await PackageService.create(formValues);
            if (res) {
                AntNotification.showNotification("Thêm thành công", "Gói cước đã được thêm thành công!", "success");
                navigate("/admin/packages");
            } else {
                AntNotification.showNotification("Có lỗi xảy ra", "Thêm gói cước thất bại!", "error");
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
                        Thêm Gói Cước
                    </h5>
                </div>
                <form className="max-w-lg mt-5" onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tên gói cước</label>
                        <input
                            type="text"
                            name="name"
                            style={{ borderRadius: '4px', padding: '11px' }}
                            placeholder="Nhập tên gói cước"
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                            value={formValues.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="duration_months" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Thời hạn (tháng)</label>
                        <input
                            type="number"
                            name="duration_months"
                            style={{ borderRadius: '4px', padding: '11px' }}
                            placeholder="Nhập số tháng"
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                            value={formValues.duration_months}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="original_price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Giá gốc</label>
                        <input
                            type="number"
                            name="original_price"
                            style={{ borderRadius: '4px', padding: '11px' }}
                            placeholder="Nhập giá gốc"
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                            value={formValues.original_price}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="discounted_price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Giá khuyến mãi</label>
                        <input
                            type="number"
                            name="discounted_price"
                            style={{ borderRadius: '4px', padding: '11px' }}
                            placeholder="Nhập giá khuyến mãi"
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                            value={formValues.discounted_price}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="discount_percent" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">% giảm giá</label>
                        <input
                            type="number"
                            name="discount_percent"
                            style={{ borderRadius: '4px', padding: '11px' }}
                            placeholder="Nhập % giảm giá (tự động nếu để trống)"
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                            value={formValues.discount_percent}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="highlight_label" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Nhãn nổi bật</label>
                        <input
                            type="text"
                            name="highlight_label"
                            style={{ borderRadius: '4px', padding: '11px' }}
                            placeholder="Ví dụ: HOT, TIẾT KIỆM 10%"
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                            value={formValues.highlight_label}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-5 flex items-center">
                        <input
                            type="checkbox"
                            name="is_best_offer"
                            checked={formValues.is_best_offer}
                            onChange={handleInputChange}
                            className="mr-2"
                        />
                        <label htmlFor="is_best_offer" className="text-sm font-medium text-gray-900 dark:text-black">Gói nổi bật</label>
                    </div>
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Thêm gói cước</button>
                </form>
            </div>
        </div>
    );
}

export default CreatePackage;