import { useState, useEffect } from "react";
import PaymentService from "@/services/api-payment";
import { AntNotification } from "@components/global/notification";
import ImageModal from "@components/admin/image_modal";
import { Link } from "react-router-dom";
import DeleteConfirmationModal from "@components/admin/delete_comfirm";
import Breadcrumb from "@components/admin/breadcrumb";
import { Loading } from "@components/loading/loading";
import { Pagination } from 'antd';


const Payment = () => {
    // Đổi tên các state cho rõ nghĩa payment
    const [isLoading, setIsLoading] = useState(false);
    const [paymentList, setPaymentList] = useState([]);
    const [selectedPaymentIds, setSelectedPaymentIds] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPayments, setTotalPayments] = useState(0);
    const [sortOrder, setSortOrder] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchInput, setSearchInput] = useState('');
    const [modalImageSrc, setModalImageSrc] = useState(null);

    const breadcrumbItems = [
        { label: "Quản Trị", path: "/admin" },
        { label: "Quản Lý Thanh Toán", path: null },
    ];

    const hanDleDelete = async () => {
        if (selectedPaymentIds.length === 0) {
            AntNotification.showNotification(
                "Không có thanh toán nào được chọn",
                "Vui lòng chọn ít nhất một thanh toán để xóa",
                "error"
            );
            return;
        }
        try {
            const res = await PaymentService.destroy(selectedPaymentIds);
            if (res?.status === 200) {
                setSelectedPaymentIds([]);
                AntNotification.showNotification(
                    "Xóa thanh toán thành công",
                    res?.message || "Xóa thanh toán thành công",
                    "success"
                );
                fetchData();
            } else {
                AntNotification.showNotification(
                    "Có lỗi xảy ra",
                    res?.message || "Vui lòng thử lại sau",
                    "error"
                );
            }
        } catch (error) {
            AntNotification.handleError(error);
        }
    };
    const fetchData = async () => {
        try {
            setIsLoading(true);
            const res = await PaymentService.getPayments({
                page: currentPage,
                per_page: pageSize,
                sort_order: sortOrder,
                keyword: searchKeyword,
            });
            if (res) {
                setPaymentList(Array.isArray(res.data) ? res.data : []);
                setTotalPayments(res.total || 0);
            } else {
                AntNotification.showNotification(
                    "Có lỗi xảy ra",
                    res?.message || "Vui lòng thử lại sau",
                    "error"
                );
            }
        } catch (error) {
            AntNotification.handleError(error);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize, sortOrder, searchKeyword]);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (searchInput !== "") {
                setCurrentPage(1);
                setSearchKeyword(searchInput);
            } else {
                setSearchKeyword("");
            }
        }, 400);
        return () => clearTimeout(debounceTimer);
    }, [searchInput]);

    const handlePageChange = async (page, size) => {
        setCurrentPage(page);
        setPageSize(size);
    }
    const handleFilterChange = async (e) => {
        const value = e.target.value;
        const sortOrder = value === "asc" ? "asc" : "desc";
        setSortOrder(sortOrder);
    };

    const openModal = (src) => {
        setModalImageSrc(src);
    };

    const closeModal = () => {
        setModalImageSrc(null);
    };

    const checkPayment = (e, id) => {
        if (e.target.checked) {
            setSelectedPaymentIds([...selectedPaymentIds, id]);
        } else {
            setSelectedPaymentIds(selectedPaymentIds.filter((paymentId) => paymentId !== id));
        }
    };

    return (
        <div className="pt-16 px-4 lg:ml-64">
            <Breadcrumb items={breadcrumbItems} />
            <div className="relative overflow-x-auto shadow-md my-4 sm:rounded-lg bg-white">
                <div className="flex justify-between items-center p-4">
                    <h5 className="text-xl font-medium leading-tight text-primary">
                        Quản Lý Thanh Toán
                    </h5>
                    <Link
                        to="/admin/payment/create"
                        className="inline-block rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white bg-indigo-600 w-auto"
                    >
                        Thêm Thanh Toán
                    </Link>
                </div>
                <div className="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 py-2 px-4 bg-white">
                    <div>
                        <select
                            className="cursor-pointer items-center text-black bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 font-medium rounded-lg text-sm px-3 py-1.5 "
                            onChange={handleFilterChange}
                        >
                            <option value="desc">
                                Mới nhất
                            </option>
                            <option value="asc">
                                Cũ Nhất
                            </option>
                        </select>
                    </div>
                    <div className="py-1 flex flex-wrap-reverse">
                        {(selectedPaymentIds.length > 0) ?
                            <DeleteConfirmationModal
                                data={`Bạn có chắc chắn muốn xóa ${selectedPaymentIds.length} thanh toán này không?`}
                                onDelete={hanDleDelete}
                            /> : null
                        }

                        <label htmlFor="table-search" className="sr-only">
                            Tìm kiếm
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg
                                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                    />
                                </svg>
                            </div>
                            <input
                                type="text"
                                id="table-search-users"
                                className="block pt-2 ps-10 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-slate-950 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Tìm kiếm theo mã đơn hàng"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-300">
                        <tr>
                            <th scope="col" className="p-4">
                                <div className="flex items-center">
                                    <input
                                        checked={selectedPaymentIds.length === paymentList.length}
                                        onChange={() => {
                                            if (selectedPaymentIds.length === paymentList.length) {
                                                setSelectedPaymentIds([]);
                                            } else {
                                                setSelectedPaymentIds(
                                                    paymentList.map((payment) => payment.id)
                                                );
                                            }
                                        }}
                                        id="checkbox-all-search"
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label htmlFor="checkbox-all-search" className="sr-only">
                                        checkbox
                                    </label>
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Mã đơn hàng
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Tên gói cước
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Người thanh toán
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Phương thức
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Giá
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Thời gian tạo
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            paymentList.length === 0 ? (
                                <tr className="">
                                    <td colSpan={7} className="text-center py-4 text-gray-500">
                                        Không có thanh toán nào
                                    </td>
                                </tr>
                            ) : paymentList.map((item) => (
                                <tr
                                    key={item.id}
                                    className="bg-white border-b  dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-200"
                                >
                                    <td className="w-4 p-4">
                                        <div className="flex items-center">
                                            <input
                                                id="checkbox-table-search-1"
                                                onChange={(e) => checkPayment(e, item.id)}
                                                checked={selectedPaymentIds.includes(item.id)}
                                                type="checkbox"
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                            />
                                            <label
                                                htmlFor="checkbox-table-search-1"
                                                className="sr-only"
                                            >
                                                checkbox
                                            </label>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-900 dark:text-slate-950 font-semibold">
                                        {item?.order_id}
                                    </td>
                                    <th
                                        scope="row"
                                        className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-slate-950"
                                    >
                                        <div className="ps-3">
                                            <div className="text-base font-semibold">
                                                {item?.package?.name}
                                            </div>
                                        </div>
                                    </th>

                                    <td className="px-6 py-4 text-gray-900 dark:text-slate-950 font-semibold">
                                        {item?.user?.fullName}
                                    </td>
                                    <td className="px-6 py-4 text-gray-900 dark:text-slate-950 font-semibold">
                                        {item?.payment_method}
                                    </td>
                                    <td className="px-6 py-4 text-gray-900 dark:text-slate-950 font-semibold">
                                        {new Intl.NumberFormat('vi-VN', {
                                            currency: 'VND',
                                        }).format(item?.amount)}đ
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(item.created_at).toLocaleDateString("vi-VN", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                        })}
                                    </td>
                                    <td className="px-6 py-4 gap-6 flex items-center">
                                        <Link
                                            to={`/admin/payments/update/${item?.id}`}
                                            type="button"
                                            data-modal-target="editUserModal"
                                            data-modal-show="editUserModal"
                                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                        >
                                            Edit
                                        </Link>
                                        <Link
                                            to={`/admin/payments/detail/${item.id}`}
                                            type="button"
                                            data-modal-target="editUserModal"
                                            data-modal-show="editUserModal"
                                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                        >
                                            Chi tiết
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
                <div className="flex justify-end p-4">
                    <Pagination className=""
                        current={currentPage}
                        defaultCurrent={1}
                        total={totalPayments}
                        onShowSizeChange={handlePageChange}
                        onChange={handlePageChange} />
                </div>
            </div>
            <Loading isLoading={isLoading} />
        </div>
    );
};

export default Payment;