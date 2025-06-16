import { useState, useEffect } from "react";
import BooksService from "@/services/api-books";
import { AntNotification } from "@components/ui/notification";
import ImageModal from "@components/admin/image_modal";
import { Link } from "react-router-dom";
import DeleteConfirmationModal from "@components/admin/delete_comfirm";
import Breadcrumb from "@components/admin/breadcrumb";
import { Loading } from "@components/loading/loading";
import { Pagination } from 'antd';


const Books = () => {
    const [loading, setLoading] = useState(false);
    const [books, setBooks] = useState([]);
    const [selectedBooks, setSelectedBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [sort_order, setSortOrder] = useState(null);
    const [keyword, setKeyword] = useState("");
    const [inputValue, setInputValue] = useState('');
    const [imageSrc, setImageSrc] = useState(null);

    const breadcrumbItems = [
        { label: "Quản Trị", path: "/admin" },
        { label: "Quản Lý Sách", path: null },
    ];

    const checkBooktype = (e, id) => {
        setSelectedBooks((prevSelected) => {
            if (e.target.checked) {
                return [...prevSelected, id];
            } else {
                return prevSelected.filter((item) => item !== id);
            }
        });
    };
    const hanDleDelete = async () => {
        if (selectedBooks.length === 0) {
            AntNotification.showNotification(
                "Không có sách nào được chọn",
                "Vui lòng chọn ít nhất một sách để xóa",
                "error"
            );
            return;
        }
        try {
            const res = await BooksService.destroy(selectedBooks);
            if (res?.status === 200) {
                setSelectedBooks([]);
                AntNotification.showNotification(
                    "Xóa sách thành công",
                    res?.message || "Xóa sách thành công",
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
            setLoading(true);
            const res = await BooksService.getBooks({
                page: currentPage,
                per_page: pageSize,
                sort_order: sort_order,
                keyword: keyword,
            });
            if (res) {
                setBooks(Array.isArray(res.data) ? res.data : []);
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
    }, [currentPage, pageSize, sort_order, keyword]);

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

    const openModal = (src) => {
        setImageSrc(src);
    };

    const closeModal = () => {
        setImageSrc(null);
    };

    return (
        <div className="pt-16 px-4 lg:ml-64">
            <Breadcrumb items={breadcrumbItems} />
            <div className="relative overflow-x-auto shadow-md my-4 sm:rounded-lg bg-white">
                <div className="flex justify-between items-center p-4">
                    <h5 className="text-xl font-medium leading-tight text-primary">
                        Quản Lý Sách
                    </h5>
                    <Link
                        to="/admin/books/create"
                        className="inline-block rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white bg-indigo-600 w-auto"
                    >
                        Thêm Sách
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
                        {(selectedBooks.length > 0) ?
                            <DeleteConfirmationModal
                                data={`Bạn có chắc chắn muốn xóa ${selectedBooks.length} quyến sách này không?`}
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
                                placeholder="Tìm kiếm theo tên loại sách"
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
                                        checked={selectedBooks.length === books.length}
                                        onChange={() => {
                                            if (selectedBooks.length === books.length) {
                                                setSelectedBooks([]); // bo chon tat ca
                                            } else {
                                                setSelectedBooks(
                                                    books.map((booktype) => booktype.id)
                                                ); // chon tat ca
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
                                Tiêu đề sách
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Hình ảnh
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Tác giả
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Thể loại
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
                            books.length === 0 ? (
                                <tr className="">
                                    <td colSpan={5} className="text-center py-4 text-gray-500">
                                        Không có sách nào
                                    </td>
                                </tr>
                            ) : books.map((item) => (
                                <tr
                                    key={item.id}
                                    className="bg-white border-b  dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-200"
                                >
                                    <td className="w-4 p-4">
                                        <div className="flex items-center">
                                            <input
                                                id="checkbox-table-search-1"
                                                onChange={(e) => checkBooktype(e, item.id)}
                                                checked={selectedBooks.includes(item.id)}
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
                                    <th
                                        scope="row"
                                        className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-slate-950"
                                    >
                                        <div className="ps-3">
                                            <div className="text-base font-semibold">
                                                {item?.title}
                                            </div>
                                        </div>
                                    </th>
                                    <td className="px-6 py-4">
                                        <a
                                            className="underline cursor-pointer"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                openModal(item.file_path);
                                            }}
                                        >
                                            Hình ảnh
                                        </a>
                                        <ImageModal imageSrc={imageSrc} closeModal={closeModal} />
                                    </td>
                                    <td className="px-6 py-4 text-gray-900 dark:text-slate-950 font-semibold">
                                        {item?.author}
                                    </td>
                                    <td className="px-6 py-4 text-gray-900 dark:text-slate-950 font-semibold">
                                        {item.categories.length > 0 ? item.categories.map((category)=>
                                            category.name
                                        ).join(", "
                                        ) : "Không có thể loại"}
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
                                            to={`/admin/books/update/${item?.id}`}
                                            type="button"
                                            data-modal-target="editUserModal"
                                            data-modal-show="editUserModal"
                                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                        >
                                            Edit
                                        </Link>
                                        <Link
                                            to={`/admin/books/chapters/${item.id}`}
                                            type="button"
                                            data-modal-target="editUserModal"
                                            data-modal-show="editUserModal"
                                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                        >
                                            List chapter
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

export default Books;