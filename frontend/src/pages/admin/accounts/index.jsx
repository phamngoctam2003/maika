import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { UsersService } from "@/services/api-user";
import { AntNotification } from "@components/ui/notification";
import ImageModal from "@components/admin/image_modal";
import DeleteConfirmationModal from "@components/admin/delete_comfirm";
import Breadcrumb from "@components/admin/breadcrumb";
import { Loading } from "@components/loading/loading";

import { Pagination } from 'antd';

export const Accounts = () => {
    const urlSRC = import.meta.env.VITE_URL_IMG;
    const [loading, setLoading] = useState(false);
    const [users, setUser] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [sortorder, setSortOrder] = useState(null);
    const [keyword, setKeyword] = useState("");
    const [inputValue, setInputValue] = useState('');

    const breadcrumbItems = [
        { label: "Quản trị", path: "/admin" },
        { label: "Quản Lý Tài Khoản", path: null },
    ];


    const checkUser = (e, id) => {
        setSelectedUsers((prevselectedUsers) => {
            if (e.target.checked) {
                return [...prevselectedUsers, id];
            } else {
                return prevselectedUsers.filter((item) => item !== id);
            }
        });
    };
    const hanDleDelete = async () => {
        if (selectedUsers.length === 0) {
            AntNotification.showNotification(
                "Chưa có người dùng nào được chọn",
                "Vui lòng chọn ít nhất một người dùng",
                "error"
            );
            return;
        }
        try {
            const res = await UsersService.destroy(selectedUsers);
            if (res?.status === 200) {
                fetchData();
                setSelectedUsers([]);
                AntNotification.showNotification(
                    "Xóa thành công",
                    res?.message,
                    "success"
                );
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
            setLoading(true);
            const res = await UsersService.getAllUsers({
                page: currentPage,
                per_page: pageSize,
                sortorder: sortorder,
                keyword: keyword,
            });
            if (res) {
                console.log(res);
                setUser(Array.isArray(res.data) ? res.data : []);
                setTotalItems(res.total || 0);
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
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize, sortorder, keyword]);

    const handleStatusChange = async (id, status) => {
        try {
            const res = await UsersService.upadteStatus({ id, status });
            if (res?.status === 200) {
                setUser((prevUsers) => {
                    return prevUsers.map((user) => {
                        if (user.id === id) {
                            return { ...user, status };
                        }
                        return user;
                    });
                });
                AntNotification.showNotification(
                    "Cập nhật thành công",
                    res?.message,
                    "success"
                );
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
    }

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (inputValue !== "") {
                setCurrentPage(1);
                setKeyword(inputValue);
            } else {
                setKeyword("");
            }
        }, 400);
        return () => clearTimeout(debounceTimer);
    }, [inputValue]);

    const handlePageChange = async (page, size) => {
        setCurrentPage(page);
        setPageSize(size);
    }
    const handleFilterChange = async (e) => {
        const value = e.target.value;
        const sortOrder = value === "asc" ? "asc" : "desc";
        setSortOrder(sortOrder);
    };
    return (
        <div className="pt-16 px-4 lg:ml-64">
              <Breadcrumb items={breadcrumbItems}/>
            <div className="relative overflow-x-auto shadow-md my-4 sm:rounded-lg bg-white">
                <div className="flex justify-between items-center p-4">
                    <h5 className="text-xl font-medium leading-tight text-primary">
                        Quản Lý Tài Khoản
                    </h5>
                    <Link
                        to="/admin/accounts/create"
                        className="inline-block rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white bg-indigo-600 w-auto"
                    >
                        Thêm Tài Khoản
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
                        {/* {(selectedUsers.length > 0) ?
                            <DeleteConfirmationModal
                                data={`Bạn có chắc chắn muốn xóa ${selectedUsers.length} người dùng này không?`}
                                onDelete={hanDleDelete}
                            /> : null
                        } */}
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
                                placeholder="Tìm kiếm tên tài khoản hoặc email"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
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
                                        checked={selectedUsers.length === users.length}
                                        onChange={() => {
                                            if (selectedUsers.length === users.length) {
                                                setSelectedUsers([]); // bo chon tat ca
                                            } else {
                                                setSelectedUsers(
                                                    users.map((user) => user.id)
                                                ); // chon tat ca
                                            }
                                        }}
                                        id="checkbox-all-search"
                                        type="checkbox"
                                        className="w-4 h-4 cursor-pointer text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label htmlFor="checkbox-all-search" className="sr-only">
                                        checkbox
                                    </label>
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Tên
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Trạng thái
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr className="">
                                <td colSpan={4} className="text-center py-4 text-gray-500">
                                    Không có tài khoản nào
                                </td>
                            </tr>
                        ) : users.map((user) => (
                            <tr
                                key={user.id}
                                className="bg-white border-b  dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-200"
                            >
                                <td className="w-4 p-4">
                                    <div className="flex items-center">
                                        <input
                                            id="checkbox-table-search-1"
                                            onChange={(e) => checkUser(e, user.id)}
                                            checked={selectedUsers.includes(user.id)}
                                            type="checkbox"
                                            className="w-4 h-4 cursor-pointer text-blue-600 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <label
                                            htmlFor="checkbox-table-search-1"
                                            className="sr-only"
                                        >
                                            checkbox
                                        </label>
                                    </div>
                                </td>
                                <th
                                    scope="row"
                                    className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-slate-950"
                                >
                                    {
                                        user && user.avatar
                                            ? <img src={`${urlSRC}${user.avatar}`} className="w-12 h-12 rounded-full object-cove" alt="Avatar" />
                                            : <img src="/images/jpg/th.jpg" className="w-12 h-12 rounded-full object-cover" alt="Default avatar" />
                                    }
                                    <div className="ps-3">
                                        <div className="text-base font-semibold">
                                            {user.fullName}
                                        </div>
                                        <div className="font-normal text-gray-500">
                                            {user.email}
                                        </div>
                                    </div>
                                </th>
                                <td className="px-6 py-4">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" value={(user.status === 1) ? 0 : 1}
                                            checked={user.status === 1}
                                            onChange={(e) => handleStatusChange(user.id, e.target.checked ? 1 : 0)}
                                        />
                                        <div className="group peer bg-white rounded-full duration-300 w-16 h-8 ring-2 ring-red-500 after:duration-300 after:bg-red-500 peer-checked:after:bg-green-500 peer-checked:ring-green-500 after:rounded-full after:absolute after:h-6 after:w-6 after:top-1 after:left-1 after:flex after:justify-center after:items-center peer-checked:after:translate-x-8 peer-hover:after:scale-95" />
                                    </label>
                                </td>

                                <td className="px-6 py-4 gap-4 flex">
                                    <Link
                                        to={`/admin/accounts/rolelevel/${user.id}`}
                                        type="button"
                                        data-modal-target="editUserModal"
                                        data-modal-show="editUserModal"
                                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                    >
                                        Cấp vai trò
                                    </Link>
                                    <Link
                                        to={`/admin/accounts/update/${user.id}`}
                                        type="button"
                                        className="font-medium text-orange-700 dark:text-orange-600 hover:underline"
                                    >
                                        Chỉnh sửa
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
                        total={totalItems}
                        onShowSizeChange={handlePageChange}
                        onChange={handlePageChange} />
                </div>
            </div>
            <Loading isLoading={loading} />
        </div>
    );
};
