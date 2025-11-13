import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AntNotification } from "@components/global/notification";
import BannerService from "@/services/api-banners";
import { Upload } from "antd";
import Breadcrumb from "@components/admin/breadcrumb";
const Create_banner = () => {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);

  const breadcrumbItems = [
    { label: "Quản trị", path: "/admin" },
    { label: "Quản Lý Banner", path: "/banners" },
    { label: "Thêm Banner", path: null },
  ];

  const handSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    if (form.status.checked) {
      data.set("status", 1);
    } else {
      data.set("status", 0);
    }

    if (imageFile) {
      data.append("image_url", imageFile);
    } else {
      AntNotification.showNotification(
        "Có lỗi xảy ra",
        "Vui lòng tải lên hình ảnh!" || res.message,
        "warning"
      );
    }
    try {
      const res = await BannerService.create(data);
      if (res) {
        AntNotification.showNotification(
          "Thêm thành công",
          "Banner đã được thêm thành công!" || res.message,
          "success"
        );
        navigate("/admin/banners");
      } else {
        AntNotification.showNotification(
          "Có lỗi xảy ra",
          "Thêm banner thất bại!" || res.message,
          "error"
        );
      }
    } catch (error) {
      AntNotification.handleError(error);
    }
  };

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

  const onChangeFormat = (e) => {
    setFormatId(e);
  };
  return (
    <div className="pt-16 px-4 lg:ml-64">
      <Breadcrumb items={breadcrumbItems} />
      <div className="bg-white shadow rounded-lg mb-4 p-4 h-full">
        <div className="flex justify-between items-center my-2">
          <h5 className="text-xl font-medium leading-tight text-primary">
            Thêm Banner
          </h5>
        </div>
        <form className="max-w-lg mt-5" onSubmit={handSubmit}>
          <div className="mb-5">
            <label
              htmlFor="link"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Tiêu Đề Banner
            </label>
            <input
              type="text"
              name="title"
              style={{ borderRadius: "4px", padding: "11px" }}
              placeholder="Nhập tiêu đề"
              className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="link"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Link Banner
            </label>
            <input
              type="text"
              name="link"
              style={{ borderRadius: "4px", padding: "11px" }}
              placeholder="Nhập link"
              className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Mô Tả Danh Mục
            </label>

            <div className="mb-5">
              <Upload
                className="custom-upload"
                name="image_url"
                maxCount={1}
                {...uploadProps}
              >
                <div className="flex items-center px-4 py-2 text-sm font-medium cursor-pointer text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M12 4.5v10m0-10c-.7 0-2.008 1.994-2.5 2.5M12 4.5c.7 0 2.008 1.994 2.5 2.5m5.5 9.5c0 2.482-.518 3-3 3H7c-2.482 0-3-.518-3-3"
                      color="currentColor"
                    />
                  </svg>
                  <span className="ml-2">Tải lên hình ảnh</span>
                </div>
              </Upload>
            </div>
          </div>
          <div className="mb-5">
            <label
              htmlFor="sort_order"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Thứ tự hiển thị
            </label>
            <input
              type="text"
              name="sort_order"
              style={{ borderRadius: "4px", padding: "11px" }}
              placeholder="Nhập thứ tự hiển thị"
              className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
            />
          </div>
          <div className="mb-5 flex flex-col items-start">
            <label
              htmlFor="status"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Hiển thị
            </label>
            <label className="neon-checkbox w-14">
              <input type="checkbox" name="status" />
              <div className="neon-checkbox__frame">
                <div className="neon-checkbox__box">
                  <div className="neon-checkbox__check-container">
                    <svg viewBox="0 0 24 24" className="neon-checkbox__check">
                      <path d="M3,12.5l7,7L21,5"></path>
                    </svg>
                  </div>
                  <div className="neon-checkbox__glow"></div>
                  <div className="neon-checkbox__borders">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div className="neon-checkbox__effects">
                  <div className="neon-checkbox__particles">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span> <span></span>
                    <span></span>
                    <span></span>
                    <span></span> <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="neon-checkbox__rings">
                    <div className="ring"></div>
                    <div className="ring"></div>
                    <div className="ring"></div>
                  </div>
                  <div className="neon-checkbox__sparks">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </label>
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Create_banner;
