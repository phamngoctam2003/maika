import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AntNotification } from "@components/global/notification";
import CategoriesService from "@/services/api-categories";
import Breadcrumb from "@components/admin/breadcrumb";
export const Create_category = () => {
    const navigate = useNavigate();

    const breadcrumbItems = [
        { label: "Quản trị", path: "/admin" },
        { label: "Quản Lý Danh Mục", path: "/categories" },
        { label: "Thêm Danh Mục", path: null },
    ];

    const handSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);
        try {
            const res = await CategoriesService.create(data);
            if (res) {
                AntNotification.showNotification("Thêm thành công", "Danh mục đã được thêm thành công!" || res.message, "success");
                navigate("/admin/categories");
            } else {
                AntNotification.showNotification("Có lỗi xảy ra", "Thêm danh mục thất bại!" || res.message, "error");

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
                        Thêm Danh Mục
                    </h5>
                </div>
                <form className="max-w-lg mt-5" onSubmit={handSubmit}>
                    <div className="mb-5">
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tên Danh Mục</label>
                        <input type="text"
                            name="name"
                            style={{ borderRadius: '4px', padding: '11px' }}
                            placeholder="Nhập tên danh mục"
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Mô Tả Danh Mục</label>
                        <textarea
                            placeholder="Nhập mô tả danh mục"
                            style={{ borderRadius: '4px', padding: '11px', height: '200px' }}
                            type="description" id="description" name="description"
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 w-full" />
                    </div>
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                </form>
            </div>
        </div>
    );
}