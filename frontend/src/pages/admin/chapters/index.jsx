import { useState, useEffect } from "react";
import ChapterService from "@/services/api-chapters";
import { AntNotification } from "@components/ui/notification";
import { Link, useParams } from "react-router-dom";
import DeleteConfirmationModal from "@components/admin/delete_comfirm";
import Breadcrumb from "@components/admin/breadcrumb";
import { Loading } from "@components/loading/loading";
import { Pagination } from 'antd';


const Chapters = () => {
    const URL_API = import.meta.env.VITE_URL_IMG;
    const [loading, setLoading] = useState(false);
    const [chapters, setChapters] = useState([]);
    const [selectedChapter, setSelectedchapter] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [sort_order, setSortOrder] = useState(null);
    const [keyword, setKeyword] = useState("");
    const [inputValue, setInputValue] = useState('');

    const { bookId } = useParams();
    const breadcrumbItems = [
        { label: "Quản Trị", path: "/admin" },
        { label: "Quản Lý Sách", path: "/admin/books" },
        { label: "Quản Lý Chương Sách", path: null },
    ];

    const checkChapterType = (e, id) => {
        setSelectedchapter((prevSelected) => {
            if (e.target.checked) {
                return [...prevSelected, id];
            } else {
                return prevSelected.filter((item) => item !== id);
            }
        });
    };
    const hanDleDelete = async () => {
        if (selectedChapter.length === 0) {
            AntNotification.showNotification(
                "Không có chương nào được chọn",
                "Vui lòng chọn ít nhất một chương để xóa",
                "error"
            );
            return;
        }
        try {
            const res = await ChapterService.destroy(selectedChapter);
            if (res?.status === 200) {
                setSelectedchapter([]);
                AntNotification.showNotification(
                    "Xóa chương thành công",
                    res?.message || "Xóa chương thành công",
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
            const res = await ChapterService.getChapters({
                book_id: bookId,
                page: currentPage,
                per_page: pageSize,
                sort_order: sort_order,
                keyword: keyword,
            });
            if (res) {
                setChapters(Array.isArray(res.data) ? res.data : []);
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
    return (
        <div className="pt-16 px-4 lg:ml-64">
            <Breadcrumb items={breadcrumbItems} />
            <div className="relative overflow-x-auto shadow-md my-4 sm:rounded-lg bg-white">
                <div className="flex justify-between items-center p-4">
                    <h5 className="text-xl font-medium leading-tight text-primary">
                        Quản Lý Chương Sách
                    </h5>
                    <Link
                        to={'/admin/books/chapters/create/' + bookId}
                        className="inline-block rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white bg-indigo-600 w-auto"
                    >
                        Thêm chương
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
                        {(selectedChapter.length > 0) ?
                            <DeleteConfirmationModal
                                data={`Bạn có chắc chắn muốn xóa ${selectedChapter.length} chương này không?`}
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
                                placeholder="Tìm kiếm theo tên chương"
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
                                        checked={selectedChapter.length === chapters.length}
                                        onChange={() => {
                                            if (selectedChapter.length === chapters.length) {
                                                setSelectedchapter([]); // bo chon tat ca
                                            } else {
                                                setSelectedchapter(
                                                    chapters.map((chapter) => chapter.id)
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
                                Tên chương
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Tên sách
                            </th>
                            {
                                chapters.some(chapter => chapter.audio_path) &&
                                <th scope="col" className="px-6 py-3">
                                    Audio
                                </th>
                            }
                            <th scope="col" className="px-6 py-3">
                                Người tạo
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Thời gian tạo
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Thời gian sửa
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            chapters.length === 0 ? (
                                <tr className="">
                                    <td colSpan={5} className="text-center py-4 text-gray-500">
                                        Không có chương nào
                                    </td>
                                </tr>
                            ) : chapters.map((chapter) => (
                                <tr
                                    key={chapter.id}
                                    className="bg-white border-b  dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-200"
                                >
                                    <td className="w-4 p-4">
                                        <div className="flex items-center">
                                            <input
                                                id="checkbox-table-search-1"
                                                onChange={(e) => checkChapterType(e, chapter.id)}
                                                checked={selectedChapter.includes(chapter.id)}
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
                                        <div className="text-base font-semibold truncate">
                                            {chapter.title}
                                        </div>
                                    </th>
                                    <td className="px-6 py-4 text-gray-800 dark:text-slate-650 font-semibold truncate">
                                        {chapter.book ? chapter.book.title : "Không có sách"}
                                    </td>
                                    {
                                        chapter.audio_path && (
                                            <td className="px-6 py-4 min-w-80 text-gray-800 dark:text-slate-650 font-semibold truncate">
                                                {
                                                    chapter.audio_path ? (
                                                        <audio controls className="w-full">
                                                            <source src={URL_API + chapter.audio_path} type="audio/mpeg" />
                                                            Trình duyệt của bạn không hỗ trợ audio.
                                                        </audio>) : (
                                                        <span className="text-red-500">Không có audio</span>
                                                    )
                                                }
                                            </td>
                                        )
                                    }

                                    <td className="px-6 py-4 text-gray-900 dark:text-slate-950 font-semibold truncate">
                                        {chapter?.user.fullName || "Không có người tạo"}
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(chapter.created_at).toLocaleDateString("vi-VN", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                        })}
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(chapter.updated_at).toLocaleDateString("vi-VN", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                        })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link
                                            to={`/admin/books/chapters/update/${chapter.id}`}
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
            <Loading isLoading={loading} />
        </div>
    );
};

export default Chapters;