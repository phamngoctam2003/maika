import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { AntNotification } from "@components/global/notification";
import BooksService from "@/services/api-books";
import Breadcrumb from "@components/admin/breadcrumb";
import { Select, Upload, Radio, Checkbox } from "antd";

const Update_Book = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const URL_IMG = import.meta.env.VITE_URL_IMG;
    const [categoryId, setCategoryId] = useState([]);
    const [formatId, setFormatId] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [formatOptions, setFormatOptions] = useState([]);
    const [authorOptions, setAuthorOptions] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [author, setAuthor] = useState([]);
    const [formValues, setFormValues] = useState({
        title: "",
        publication_year: "",
        description: "",
        access_type: "free",
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [bookData, setBookData] = useState(null);

    // Breadcrumb items
    const breadcrumbItems = [
        { label: "Quản Trị", path: "/admin" },
        { label: "Quản Lý Sách", path: "/admin/books" },
        { label: "Cập Nhật Sách", path: null },
    ];

    // Lấy dữ liệu sách theo id
    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await BooksService.getById(id);
                if (res) {
                    const book = res;
                    setBookData(book);
                    setFormValues({
                        title: book.title || "",
                        publication_year: book.publication_year || "",
                        description: book.description || "",
                        access_type: book.access_type || "free",
                    });
                    setFormatId(book.formats?.map(f => f.id) || []);
                    setAuthor(book.authors?.map(a => String(a.id)) || []);
                    setImagePreview(book.file_path || null);
                    setAuthorOptions(book.authors?.map(a => ({
                        value: String(a.id),
                        label: a.name,
                    })) || []);
                } else {
                    AntNotification.showNotification("Có lỗi xảy ra", "Không thể tải dữ liệu sách!", "error");
                }
            } catch (error) {
                AntNotification.handleError(error);
            }
        };
        if (id) fetchBook();
    }, [id]);

    // Lấy danh mục
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await BooksService.getAllCategories();
                if (res) {
                    const options = res.map((category) => ({
                        value: category.id,
                        label: category.name,
                    }));
                    setCategoryOptions(options);
                } else {
                    AntNotification.showNotification("Có lỗi xảy ra", "Không thể tải danh sách books!" || res.message, "error");
                }
            } catch (error) {
                AntNotification.handleError(error);
            }
        };
        fetchCategories();
    }, []);

    // Đổ categoryId ra khi cả bookData và categoryOptions đã có
    useEffect(() => {
        if (bookData && categoryOptions.length > 0) {
            setCategoryId(bookData.categories?.map(c => c.id) || []);
        }
    }, [bookData, categoryOptions]);

    // Lấy thể loại
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
            setImagePreview(null);
            return false; // chặn upload tự động của antd
        },
        onRemove: () => {
            setImageFile(null);
            setImagePreview(null);
        },
        showUploadList: {
            showRemoveIcon: true,
        }
    };
    const onChangeFormat = e => {
        setFormatId(e);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAccessTypeChange = (e) => {
        setFormValues(prev => ({
            ...prev,
            access_type: e.target.value
        }));
    };

    const handSubmit = async (e) => {
        e.preventDefault();
        // Không cần dùng biến form nếu không lấy value từ form HTML
        const data = new FormData();

        data.append("title", formValues.title);
        data.append("publication_year", formValues.publication_year);
        data.append("description", formValues.description);
        data.append("access_type", formValues.access_type);

        categoryId.forEach((id) => {
            data.append("category_id[]", id);
        });
        formatId.forEach((id) => {
            data.append("format_id[]", id);
        });
        if (imageFile) {
            data.set("file_path", imageFile);
        }
        author.forEach((id) => {
            data.append("author[]", id);
        });

        try {
            const res = await BooksService.update(id, data);
            if (res) {
                AntNotification.showNotification("Cập nhật thành công", "Sách đã được cập nhật thành công!" || res.message, "success");
                navigate("/admin/books");
            } else {
                AntNotification.showNotification("Có lỗi xảy ra", "Cập nhật sách thất bại!" || res.message, "error");
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
                        Cập Nhật Sách
                    </h5>
                </div>
                <form className="max-w-lg mt-5" onSubmit={handSubmit}>
                    <div className="mb-5">
                        <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tiêu đề</label>
                        <input
                            type="text"
                            name="title"
                            style={{ borderRadius: '4px', padding: '11px' }}
                            placeholder="Nhập tiêu đề sách"
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                            value={formValues.title}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="publication_year" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Năm xuất bản</label>
                        <input
                            type="number"
                            name="publication_year"
                            style={{ borderRadius: '4px', padding: '11px' }}
                            placeholder="Nhập năm xuất bản"
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                            value={formValues.publication_year}
                            onChange={handleInputChange}
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
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tác giả</label>
                        <Select
                            mode="tags"
                            showSearch
                            style={{
                                height: '44px',
                                minHeight: '44px',
                            }}
                            className="w-full custom-select-tag"
                            placeholder="Tùy chọn tác giả"
                            optionFilterProp="label"
                            options={authorOptions}
                            value={author}
                            onChange={setAuthor}
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
                            value={formatId}
                            onChange={onChangeFormat}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                            Quyền truy cập
                        </label>
                        <Radio.Group
                            name="access_type"
                            className="flex flex-wrap gap-4"
                            value={formValues.access_type}
                            style={{ width: '100%' }}
                            options={[
                                { value: 'free', label: 'Miễn phí' },
                                { value: 'member', label: 'Hội viên' }
                            ]}
                            onChange={handleAccessTypeChange}
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
                        {imagePreview ? (
                            <img src={URL_IMG + imagePreview} alt="Preview" style={{ marginTop: 10, maxHeight: 180 }} />
                        ) : null}
                    </div>
                    <div className="mb-5">
                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Mô tả</label>
                        <textarea
                            name="description"
                            style={{ borderRadius: '4px', padding: '11px', height: '200px' }}
                            placeholder="Nhập mô tả sách"
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                            value={formValues.description}
                            onChange={handleInputChange}
                        />
                    </div>
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Cập nhật</button>
                </form>
            </div>
        </div>
    );
}

export default Update_Book;