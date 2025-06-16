import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { AntNotification } from "@components/ui/notification";
import { QuillEditor } from "@components/editor/quilleditor";

import ChapterService from "@/services/api-chapters";
import Breadcrumb from "@components/admin/breadcrumb";
import { Select, Upload, Radio, Checkbox } from "antd";
const Create_Chapter = () => {
    const navigate = useNavigate();
    const [editorData, setEditorData] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const { bookId } = useParams();
    // Breadcrumb items

    const breadcrumbItems = [
        { label: "Quản Trị", path: "/admin" },
        { label: "Quản Lý Sách", path: "/admin/books" },
        { label: "Quản Lý Chương Sách", path: `/admin/books/chapters/` + bookId },
        { label: "Thêm Chương", path: null },
    ];

    const handleEditorChange = (data) => {
        setEditorData(data);
    };

    const handSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);

        // if (imageFile) {
        //     data.append("file_path", imageFile);
        // }
        data.append("book_id", bookId);
        data.append("content", editorData);
        try {
            const res = await ChapterService.create(data);
            if (res) {
                AntNotification.showNotification("Thêm thành công", "Chương đã được thêm thành công!" || res.message, "success");
                navigate("/admin/books/chapters/" + bookId);
            } else {
                AntNotification.showNotification("Có lỗi xảy ra", "Thêm chương thất bại!" || res.message, "error");

            }
        } catch (error) {
            AntNotification.handleError(error);
        }
    }

    return (
        <div className="pt-16 px-4 lg:ml-64">
            <Breadcrumb items={breadcrumbItems} />
            <div className="bg-white shadow rounded-lg mb-4 p-4 h-full">
                <div className="flex justify-between items-center my-2">
                    <h5 className="text-xl font-medium leading-tight text-primary">
                        Thêm Chương Sách
                    </h5>
                </div>
                <form className="max-w-lg mt-5" onSubmit={handSubmit}>
                    <div className="mb-5">
                        <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tiêu đề</label>
                        <input type="text"
                            name="title"
                            style={{ borderRadius: '4px', padding: '11px' }}
                            placeholder="Nhập tiêu đề chương"
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="chapter_order" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Thứ tự chương</label>
                        <input type="number"
                            name="chapter_order"
                            style={{ borderRadius: '4px', padding: '11px' }}
                            placeholder="Nhập thứ tự chương"
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                        />
                    </div>

                    <div className="mb-5">
                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Mô tả</label>
                        <QuillEditor
                            onChange={handleEditorChange}
                        />
                    </div>

                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default Create_Chapter;