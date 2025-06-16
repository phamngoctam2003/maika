import { useNavigate, Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { AntNotification } from "@components/ui/notification";
import { Loading } from "@components/loading/loading";
import BooktypeService from "@/services/api-book-types";
import CategoriesService from "@/services/api-categories";
import Breadcrumb from "@components/admin/breadcrumb";
import { Select } from "antd";
const Update_Booktype = () => {
    const { bookTypeId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [bookType, setBookType] = useState({});
    const [categoryId, setCategoryId] = useState('');
    const [categoryOptions, setCategoryOptions] = useState([]);
    // Breadcrumb items

    const breadcrumbItems = [
        { label: "Quản Trị", path: "/admin" },
        { label: "Quản Lý Loại Sách", path: "/admin/book-types" },
        { label: "Cập Nhật Loại Sách", path: null },
    ];

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
                }
            } catch (error) {
                AntNotification.handleError(error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await BooktypeService.getById(bookTypeId);
                if (res) {
                    setBookType(res);
                    setCategoryId(res.category_id || '');
                }
            } catch (error) {
                AntNotification.handleError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [bookTypeId]);


    const handSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);
        data.append("category_id", categoryId);
        try {
            const res = await BooktypeService.update(bookTypeId, data);
            if (res) {
                AntNotification.showNotification("Cập nhật thành công", "Loại sách đã được cập nhật thành công!" || res.message, "success");
                navigate("/admin/book-types");
            } else {
                AntNotification.showNotification("Có lỗi xảy ra", "Cập nhật loại sách thất bại!" || res.message, "error");
            }
        } catch (error) {
            AntNotification.handleError(error);
        }
    }

    console.log("categoryId", categoryId);
    return (
        <div className="pt-16 px-4 lg:ml-64">
            <Breadcrumb items={breadcrumbItems} />
            <div className="bg-white shadow rounded-lg mb-4 p-4 h-full">
                <div className="flex justify-between items-center my-2">
                    <h5 className="text-xl font-medium leading-tight text-primary">
                        Thêm Loại Sách
                    </h5>
                </div>
                <form className="max-w-lg mt-5" onSubmit={handSubmit}>
                    <div className="mb-5">
                        <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tên loại sách</label>
                        <input type="text"
                            name="name"
                            defaultValue={bookType?.name || ''}
                            style={{ borderRadius: '6px', padding: '11px' }}
                            placeholder="Nhập tên loại sách"
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Danh Mục</label>
                        <Select
                            showSearch
                            name="category_id"
                            placeholder="Search to Select"
                            optionFilterProp="label"
                            options={categoryOptions}
                            value={categoryId}
                            onChange={setCategoryId}
                            style={{
                                borderRadius: '6px',
                                height: '44px',
                                lineHeight: '44px',
                            }}
                            className="w-full"
                        />
                    </div>
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                </form>
            </div>
            <Loading isLoading={loading} />
        </div>
    );
}

export default Update_Booktype;