import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { notification as Notification } from "antd";
import { createCategory } from "../../../services/api-categories";
export const Create_category = () => {
    const navigate = useNavigate();
    const handSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);
        try {
            const res = await createCategory(data);
            if (res?.status === 200) {
                Notification.success({
                    message: "Thêm thành công",
                    description: res?.message || "Vui lòng thử lại sau",
                    duration: 5,
                });
                navigate("/dashboard/categories");
            } else {
                Notification.error({
                    message: "Có lỗi xảy ra",
                    description: res?.message || "Vui lòng thử lại sau",
                    duration: 5,
                });
            }
        } catch (error) {
            Notification.error({
                message: "Lỗi trong quá trình gọi api",
                description: error.message || "Vui lòng thử lại sau",
                duration: 5,
            });
        }
    }
    return (
        <div className="pt-20 px-4 ml-64">
            <div className="bg-white shadow rounded-lg mb-4 p-4 sm:p-6 h-full">
                <nav className="rounded-md w-full">
                    <ol className="list-reset flex">
                        <li>
                            <a
                                href="/admin"
                                className="text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                            >
                                Dashboard
                            </a>
                        </li>
                        <li>
                            <span className="mx-2 text-neutral-500 dark:text-neutral-400">
                                /
                            </span>
                        </li>
                        <li>
                            <a
                                href="/admin/categories"
                                className="text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                            >
                                Quản Lý Danh Mục
                            </a>
                        </li>
                        <li>
                            <span className="mx-2 text-neutral-500 dark:text-neutral-400">
                                /
                            </span>
                        </li>
                        <li className="text-neutral-500 dark:text-neutral-400">
                            Thêm Danh Mục
                        </li>
                    </ol>
                </nav>
                <div className="flex justify-between items-center my-4">
                    <h5 className="text-xl font-medium leading-tight text-primary">
                        Thêm Danh Mục
                    </h5>
                </div>
                <form className="max-w-sm mt-5" onSubmit={handSubmit}>
                    <div className="mb-5">
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tên Danh Mục</label>
                        <input type="name" name="name" id="name" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Mô Tả Danh Mục</label>
                        <textarea type="description" id="description" name="description" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" />
                    </div>
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                </form>
            </div>
        </div>
    );
}