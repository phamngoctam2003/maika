import { useState, useEffect } from "react";
import PackageService from "@/services/api-package";
import { AntNotification } from "@components/global/notification";
import { Link } from "react-router-dom";
import DeleteConfirmationModal from "@components/admin/delete_comfirm";
import Breadcrumb from "@components/admin/breadcrumb";
import { Loading } from "@components/loading/loading";
import { Pagination } from 'antd';


const Packages = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [packageList, setPackageList] = useState([]);
    const [selectedPackageIds, setSelectedPackageIds] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPackages, setTotalPackages] = useState(0);
    const [sortOrder, setSortOrder] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchInput, setSearchInput] = useState('');

    const breadcrumbItems = [
        { label: "Quản Trị", path: "/admin" },
        { label: "Quản Lý Gói Cước", path: null },
    ];

    const handleDelete = async () => {
        if (selectedPackageIds.length === 0) {
            AntNotification.showNotification(
                "Không có gói cước nào được chọn",
                "Vui lòng chọn ít nhất một gói cước để xóa",
                "error"
            );
            return;
        }
        try {
            const res = await PackageService.destroy(selectedPackageIds);
            if (res?.status === 200) {
                setSelectedPackageIds([]);
                AntNotification.showNotification(
                    "Xóa gói cước thành công",
                    res?.message || "Xóa gói cước thành công",
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
            const res = await PackageService.getPackages({
                page: currentPage,
                per_page: pageSize,
                sort_order: sortOrder,
                keyword: searchKeyword,
            });
            if (res) {
                setPackageList(Array.isArray(res.data) ? res.data : []);
                setTotalPackages(res.total || 0);
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
    const checkPackage = (e, id) => {
        if (e.target.checked) {
            setSelectedPackageIds([...selectedPackageIds, id]);
        } else {
            setSelectedPackageIds(selectedPackageIds.filter((packageId) => packageId !== id));
        }
    };

    return (
        <div className="pt-16 px-4 lg:ml-64">
            <Breadcrumb items={breadcrumbItems} />
            <div className="relative overflow-x-auto shadow-md my-4 sm:rounded-lg bg-white">
                <div className="flex justify-between items-center p-4">
                    <h5 className="text-xl font-medium leading-tight text-primary">
                        Quản Lý Gói Cước
                    </h5>
                    <Link
                        to="/admin/packages/create"
                        className="inline-block rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white bg-indigo-600 w-auto"
                    >
                        Thêm Gói Cước
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
                        {(selectedPackageIds.length > 0) ?
                            <DeleteConfirmationModal
                                data={`Bạn có chắc chắn muốn xóa ${selectedPackageIds.length} gói cước này không?`}
                                onDelete={handleDelete}
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
                                id="table-search-packages"
                                className="block pt-2 ps-10 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-slate-950 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Tìm kiếm theo tên gói cước"
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
                                        checked={selectedPackageIds.length === packageList.length}
                                        onChange={() => {
                                            if (selectedPackageIds.length === packageList.length) {
                                                setSelectedPackageIds([]);
                                            } else {
                                                setSelectedPackageIds(
                                                    packageList.map((pkg) => pkg.id)
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
                                Tên gói cước
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Thời hạn (tháng)
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Giá gốc
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Giá khuyến mãi
                            </th>
                            <th scope="col" className="px-6 py-3">
                                % giảm giá
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Nhãn nổi bật
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Người thêm
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Ngày tạo
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            packageList.length === 0 ? (
                                <tr className="">
                                    <td colSpan={10} className="text-center py-4 text-gray-500">
                                        Không có gói cước nào
                                    </td>
                                </tr>
                            ) : packageList.map((item) => (
                                <tr
                                    key={item.id}
                                    className="bg-white border-b  dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-200"
                                >
                                    <td className="w-4 p-4">
                                        <div className="flex items-center">
                                            <input
                                                id={`checkbox-table-search-${item.id}`}
                                                onChange={(e) => checkPackage(e, item.id)}
                                                checked={selectedPackageIds.includes(item.id)}
                                                type="checkbox"
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                            />
                                            <label
                                                htmlFor={`checkbox-table-search-${item.id}`}
                                                className="sr-only"
                                            >
                                                checkbox
                                            </label>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-900 dark:text-slate-950 font-semibold">
                                        {item?.name}
                                    </td>
                                    <td className="px-6 py-4 text-gray-900 dark:text-slate-950 font-semibold">
                                        {item?.duration_months}
                                    </td>
                                    <td className="px-6 py-4 text-gray-900 dark:text-slate-950 font-semibold">
                                        {new Intl.NumberFormat('vi-VN', { currency: 'VND' }).format(item?.original_price)}đ
                                    </td>
                                    <td className="px-6 py-4 text-gray-900 dark:text-slate-950 font-semibold">
                                        {new Intl.NumberFormat('vi-VN', { currency: 'VND' }).format(item?.discounted_price)}đ
                                    </td>
                                    <td className="px-6 py-4 text-gray-900 dark:text-slate-950 font-semibold">
                                        {item?.discount_percent}%
                                    </td>
                                    <td className="px-6 py-4 text-gray-900 dark:text-slate-950 font-semibold">
                                        {item?.highlight_label}
                                    </td>
                                    <td className="px-6 py-4 text-gray-900 dark:text-slate-950 font-semibold">
                                        {item?.user?.fullName || "Không xác định"}
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.created_at ? new Date(item.created_at).toLocaleDateString("vi-VN", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                        }) : ""}
                                    </td>
                                    <td className="px-6 py-4 gap-6 flex items-center">
                                        <Link
                                            to={`/admin/packages/update/${item?.id}`}
                                            type="button"
                                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                        >
                                            Edit
                                        </Link>
                                        {/* <Link
                                            to={`/admin/packages/detail/${item.id}`}
                                            type="button"
                                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                        >
                                            Chi tiết
                                        </Link> */}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
                <div className="flex justify-end p-4">
                    <Pagination className=""
                        current={currentPage}
                        defaultCurrent={1}
                        total={totalPackages}
                        onShowSizeChange={handlePageChange}
                        onChange={handlePageChange} />
                </div>
            </div>
            <Loading isLoading={isLoading} />
        </div>
    );
};

export default Packages;