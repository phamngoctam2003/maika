import { useState, useEffect, useRef } from "react";
import { RolesService } from "@/services/api-roles";
import { AntNotification } from "@components/ui/notification";
import { Link } from "react-router-dom";
// import DeleteConfirmationModal from "@components/delete_confirm";
import { Loading } from "@components/loading/loading";
import { Pagination } from 'antd';
export const Roles = () => {
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [sortorder, setSortOrder] = useState(null);
    const [keyword, setKeyword] = useState("");
    const [inputValue, setInputValue] = useState('');

    const checkRoles = (e, id) => {
        setSelectedRoles((prevSelect) => {
            if (e.target.checked) {
                return [...prevSelect, id];
            } else {
                return prevSelect.filter((item) => item !== id);
            }
        })
    }
    const hanDleDelete = async () => {
        if (selectedRoles.length === 0) {
            AntNotification.showNotification("Chưa có vai trò nào được chọn", "Vui lòng chọn ít nhất một vai trò để xóa", "error");
            return;
        }
        try {
            const res = await RolesService.destroy(selectedRoles);
            if (res?.status === 200) {
                setRoles((prevRole) => {
                    return prevRole.filter(
                        (role) => !selectedRoles.includes(role.id)
                    );
                });
                setSelectedRoles([]);
                AntNotification.showNotification("Xóa thành công", res.message, "success");
            } else {
                AntNotification.showNotification("Xóa thất bại", res.message, "error");
            }
        } catch (error) {
            AntNotification.handleError(error);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await RolesService.callRoles({
                    page: currentPage,
                    per_page: pageSize,
                    sortorder: sortorder,
                    keyword: keyword,
                });
                if (res) {
                    setRoles(res.data);
                    setTotalItems(res.total || 0);
                } else {
                    AntNotification.showNotification("Lỗi", "Không thể tải dữ liệu", "error");
                }
            } catch (error) {
                AntNotification.handleError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [currentPage, pageSize, sortorder, keyword]);
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
        <div className="pt-20 px-4 lg:ml-64">
            <div className="bg-white shadow rounded-lg mb-4 p-4 sm:p-6 h-full">
                <div className="main-content">
                    <nav className="rounded-md w-full">
                        <ol className="list-reset flex">
                            <li>
                                <Link
                                    to="/admin"
                                    className="text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                                >
                                    Quản Trị
                                </Link>
                            </li>
                            <li>
                                <span className="mx-2 text-neutral-500 dark:text-neutral-400">
                                    /
                                </span>
                            </li>
                            <li className="text-neutral-500 dark:text-neutral-400">
                                Quản Lý Vai Trò
                            </li>
                        </ol>
                    </nav>
                    <div className="flex justify-between items-center my-4">
                        <h5 className="text-xl font-medium leading-tight text-primary">
                            Quản Lý Vai Trò
                        </h5>
                        <Link
                            to="/admin/roles/create"
                            className="inline-block rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white bg-indigo-600 w-auto"
                        >
                            Thêm Vai Trò
                        </Link>
                    </div>

                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
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
                                {/* {(selectedRoles.length > 0) ?
                                    <DeleteConfirmationModal
                                        data={`Bạn có chắc chắn muốn xóa ${selectedRoles.length} vai trò này không?`}
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
                                        placeholder="Tìm kiếm..."
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
                                                checked={selectedRoles?.length === roles?.length}
                                                onChange={() => {
                                                    if (selectedRoles?.length === roles?.length) {
                                                        setSelectedRoles([]); // bo chon tat ca
                                                    } else {
                                                        setSelectedRoles(
                                                            roles?.map((role) => role.id)
                                                        ); // chon tat ca
                                                    }
                                                }}
                                                id="checkbox-all-search"
                                                type="checkbox"
                                                className="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                            />
                                            <label htmlFor="checkbox-all-search" className="sr-only">
                                                checkbox
                                            </label>
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Id
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Guard Name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Update Time
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    roles?.length === 0 ? (
                                        <tr className="">
                                            <td colSpan={6} className="text-center py-4 text-gray-500">
                                                Không có vai trò nào
                                            </td>
                                        </tr>
                                    ) : roles?.map((role) => (
                                        <tr
                                            key={role.id}
                                            className="bg-white border-b  dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-200"
                                        >
                                            <td className="w-4 p-4">
                                                <div className="flex items-center">
                                                    <input
                                                        id="checkbox-table-search-1"
                                                        onChange={(e) => checkRoles(e, role.id)}
                                                        checked={selectedRoles.includes(role.id)}
                                                        type="checkbox"
                                                        className="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                    />
                                                    <label
                                                        htmlFor="checkbox-table-search-1"
                                                        className="sr-only"
                                                    >
                                                        Checkbox
                                                    </label>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">{role.id}</td>
                                            <th
                                                scope="row"
                                                className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-slate-950"
                                            >
                                                <div className="">
                                                    <div className="text-base font-semibold lineclap w-60 text-limit">
                                                        {role.name}
                                                    </div>
                                                </div>
                                            </th>
                                            <td className="px-6 py-4 text-gray-700">{role.guard_name}</td>
                                            <td className="px-6 py-4 text-gray-700 tracking-wide">{new Date(role.updated_at).toLocaleDateString('vi-VN')}</td>
                                            <td className="px-6 py-4">
                                                <Link
                                                    to={`/admin/roles/update/${role.id}`}
                                                    type="button"
                                                    data-modal-target="editUserModal"
                                                    data-modal-show="editUserModal"
                                                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                                >
                                                    Edit
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
                </div>
            </div>
            <Loading isLoading={loading} />
        </div>
    );
};