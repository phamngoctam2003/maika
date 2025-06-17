import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AntNotification } from "@components/ui/notification";
import BooksService from "@/services/api-books";
import CategoriesService from "@/services/api-categories";
import Breadcrumb from "@components/admin/breadcrumb";
import { Select, Upload, Radio, Checkbox } from "antd";
const Create_Book = () => {
    const navigate = useNavigate();
    const [categoryId, setCategoryId] = useState([]);
    const [formatId, setFormatId] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [formatOptions, setFormatOptions] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    // Breadcrumb items

    const breadcrumbItems = [
        { label: "Quản Trị", path: "/admin" },
        { label: "Quản Lý Sách", path: "/admin/books" },
        { label: "Thêm Sách", path: null },
    ];

    const handSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);
        categoryId.forEach((id) => {
            data.append("category_id[]", id);
        });
        formatId.forEach((id) => {
            data.append("format_id[]", id);
        });
        if (imageFile) {
            data.append("file_path", imageFile);
        }
        data.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        });
        try {
            const res = await BooksService.create(data);
            if (res) {
                AntNotification.showNotification("Thêm thành công", "Sách đã được thêm thành công!" || res.message, "success");
                navigate("/admin/books");
            } else {
                AntNotification.showNotification("Có lỗi xảy ra", "Thêm sách thất bại!" || res.message, "error");

            }
        } catch (error) {
            AntNotification.handleError(error);
        }
    }
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await CategoriesService.getAll();
                if (res) {
                    const options = res.data.map((category) => ({
                        value: category.id,
                        label: category.name,
                    }));
                    setCategoryOptions(options);
                    // setCategoryId(options[0]?.value || '');
                } else {
                    AntNotification.showNotification("Có lỗi xảy ra", "Không thể tải danh sách books!" || res.message, "error");
                }
            } catch (error) {
                console.error("Lỗi khi fetch loại sách:", error);
                AntNotification.handleError(error);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchFormat = async () => {
            try {
                const res = await BooksService.bookFormat();
                if (res) {
                    const options = res.map((format) => ({
                        value: format.id,
                        label: format.name,
                    }));
                    setFormatOptions(options);
                } else {
                    AntNotification.showNotification("Có lỗi xảy ra", "Không thể tải thể loại" || res.message, "error");
                }
            } catch (error) {
                console.error("Lỗi khi fetch thể loại:", error);
                AntNotification.handleError(error);
            }
        };

        fetchFormat();
    }, []);
    const uploadProps = {
        multiple: false,
        listType: "picture",
        maxCount: 1,
        accept: ".jpg,.jpeg,.png,.gif,.web",
        beforeUpload: (file) => {
            setImageFile(file);
            return false; // chặn upload tự động của antd
        },
        onRemove: () => setImageFile(null),
    };

    const onChangeFormat = e => {
        setFormatId(e);
    };
    return (
        <div className="pt-16 px-4 lg:ml-64">
            <Breadcrumb items={breadcrumbItems} />
            <div className="bg-white shadow rounded-lg mb-4 p-4 h-full">
                <div className="flex justify-between items-center my-2">
                    <h5 className="text-xl font-medium leading-tight text-primary">
                        Thêm Sách
                    </h5>
                </div>
                <form className="max-w-lg mt-5" onSubmit={handSubmit}>
                    <div className="mb-5">
                        <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tiêu đề</label>
                        <input type="text"
                            name="title"
                            style={{ borderRadius: '4px', padding: '11px' }}
                            placeholder="Nhập tiêu đề sách"
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="author" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tác giả</label>
                        <input type="text"
                            name="author"
                            style={{ borderRadius: '4px', padding: '11px' }}
                            placeholder="Nhập tên tác giả"
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="publication_year" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Năm xuất bản</label>
                        <input type="number"
                            name="publication_year"
                            style={{ borderRadius: '4px', padding: '11px' }}
                            placeholder="Nhập năm xuất bản"
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Danh mục</label>
                        <Select
                            mode="multiple"
                            showSearch
                            style={{
                                height: '44px',
                                minHeight: '44px',
                            }}
                            className="w-full custom-select-tag"
                            placeholder="Chọn danh mục"
                            optionFilterProp="label"
                            options={categoryOptions}
                            value={categoryId}
                            onChange={setCategoryId}
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Thể loại</label>
                        {
                            formatOptions.length === 0 ? (
                                <p className="text-red-500 text-sm">Thể loại trống</p>
                            ) : null
                        }
                        <Checkbox.Group
                            name="format_id"
                            className="flex flex-wrap gap-4"
                            options={formatOptions}
                            onChange={onChangeFormat}
                            style={{ width: '100%' }}

                        />
                    </div>
                
                    <div className="mb-5">
                        <Upload
                            className="custom-upload"
                            name="file_path"
                            maxCount={1}
                            {...uploadProps}
                        >
                            <div className="flex items-center px-4 py-2 text-sm font-medium cursor-pointer text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.5v10m0-10c-.7 0-2.008 1.994-2.5 2.5M12 4.5c.7 0 2.008 1.994 2.5 2.5m5.5 9.5c0 2.482-.518 3-3 3H7c-2.482 0-3-.518-3-3" color="currentColor" /></svg>
                                <span className="ml-2">Tải lên hình ảnh</span>
                            </div>
                        </Upload>
                    </div>
                    <div className="mb-5">
                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Mô tả</label>
                        <textarea type="text"
                            name="description"
                            style={{ borderRadius: '4px', padding: '11px', height: '200px' }}
                            placeholder="Nhập mô tả sách"
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                        />
                    </div>


                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default Create_Book;