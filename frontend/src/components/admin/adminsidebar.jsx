import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/authcontext';
export const AdminSidebar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dropdownStates, setDropdownStates] = useState({});
    const { permissions } = useAuth();

    const toggeSidebarMobile = () => {
        setSidebarOpen(!sidebarOpen);
    }
    const toggleArrowDown = (itemId) => {
        setDropdownStates((prevState) => ({
            ...prevState,
            [itemId]: !prevState[itemId],
        }
        ));
    }
    const Menu = [
        {
            id: "1",
            name: "Quản trị",
            link: "/admin",
            svg: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM15.8329 7.33748C16.0697 7.17128 16.3916 7.19926 16.5962 7.40381C16.8002 7.60784 16.8267 7.92955 16.6587 8.16418C14.479 11.2095 13.2796 12.8417 13.0607 13.0607C12.4749 13.6464 11.5251 13.6464 10.9393 13.0607C10.3536 12.4749 10.3536 11.5251 10.9393 10.9393C11.3126 10.5661 12.9438 9.36549 15.8329 7.33748ZM17.5 11C18.0523 11 18.5 11.4477 18.5 12C18.5 12.5523 18.0523 13 17.5 13C16.9477 13 16.5 12.5523 16.5 12C16.5 11.4477 16.9477 11 17.5 11ZM6.5 11C7.05228 11 7.5 11.4477 7.5 12C7.5 12.5523 7.05228 13 6.5 13C5.94772 13 5.5 12.5523 5.5 12C5.5 11.4477 5.94772 11 6.5 11ZM8.81802 7.40381C9.20854 7.79433 9.20854 8.4275 8.81802 8.81802C8.4275 9.20854 7.79433 9.20854 7.40381 8.81802C7.01328 8.4275 7.01328 7.79433 7.40381 7.40381C7.79433 7.01328 8.4275 7.01328 8.81802 7.40381ZM12 5.5C12.5523 5.5 13 5.94772 13 6.5C13 7.05228 12.5523 7.5 12 7.5C11.4477 7.5 11 7.05228 11 6.5C11 5.94772 11.4477 5.5 12 5.5Z"></path></svg>,
            sub_menu: null
        },
        {
            id: "2",
            name: "Danh mục",
            link: "/admin/categories",
            svg: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><circle cx="17" cy="7" r="3" /><circle cx="7" cy="17" r="3" /><path d="M14 14h6v5a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-5ZM4 4h6v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4Z" /></g></svg>,
            sub_menu: [
                {
                    id: "2.1",
                    name: "Thêm",
                    link: "/admin/categories/create"
                },
                {
                    id: "2.2",
                    name: "Danh sách",
                    link: "/admin/categories"
                },
                {
                    id: "2.3",
                    name: "Danh sách đã xóa",
                    link: "/admin/categories/trash"
                },
            ]
        },
        {
            id: "3",
            name: "Sách",
            link: "/admin/books",
            svg: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><path fill="currentColor" d="M7 2H3a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1ZM5 21a2 2 0 1 1 2-2a2 2 0 0 1-2 2Zm2-9H3V3h4Zm-1 7a1 1 0 1 1-1-1a1 1 0 0 1 1 1Zm8-17h-4a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Zm-2 19a2 2 0 1 1 2-2a2 2 0 0 1-2 2Zm2-9h-4V3h4Zm-1 7a1 1 0 1 1-1-1a1 1 0 0 1 1 1Zm8-17h-4a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Zm-2 19a2 2 0 1 1 2-2a2 2 0 0 1-2 2Zm2-9h-4V3h4Zm-1 7a1 1 0 1 1-1-1a1 1 0 0 1 1 1Z" /></svg>,
            sub_menu: [
                {
                    id: "3.1",
                    name: "Thêm",
                    link: "/admin/books/create"
                },
                {
                    id: "3.2",
                    name: "Danh sách",
                    link: "/admin/books"
                },
                {
                    id: "3.3",
                    name: "Danh sách đã xóa",
                    link: "/admin/books/trash"
                },
            ]
        },
        {
            id: "4",
            name: "Gói hội viên",
            link: "/admin/packages",
            svg: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="4"><path d="M9 40L4 17l10 5L24 8l10 14l10-5l-5 23H9Z"/><path d="M24 33a4 4 0 1 0 0-8a4 4 0 0 0 0 8Z"/></g></svg>,
            sub_menu: [
                {
                    id: "4.1",
                    name: "Thêm",
                    link: "/admin/packages/create"
                },
                {
                    id: "4.2",
                    name: "Danh sách",
                    link: "/admin/packages"
                },
                {
                    id: "4.3",
                    name: "Danh sách đã xóa",
                    link: "/admin/packages/trash"
                },
            ]
        },
        {
            id: "5",
            name: "Thanh toán",
            link: "/admin/payments",
            svg: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" color="currentColor"><path d="M13.5 15H6c-1.886 0-2.828 0-3.414-.586S2 12.886 2 11V7c0-1.886 0-2.828.586-3.414S4.114 3 6 3h12c1.886 0 2.828 0 3.414.586S22 5.114 22 7v5c0 .932 0 1.398-.152 1.765a2 2 0 0 1-1.083 1.083C20.398 15 19.932 15 19 15"/><path d="M14 9a2 2 0 1 1-4 0a2 2 0 0 1 4 0m-1 8a3 3 0 0 1 3-3v-2a3 3 0 0 1 3-3v5.5c0 2.335 0 3.502-.472 4.386a4 4 0 0 1-1.642 1.642C16.002 21 14.835 21 12.5 21H12c-1.864 0-2.796 0-3.53-.305a4 4 0 0 1-2.166-2.164C6 17.796 6 16.864 6 15"/></g></svg>,
            sub_menu: [
                // {
                //     id: "4.1",
                //     name: "Thêm",
                //     link: "/admin/payment/create"
                // },
                {
                    id: "5.2",
                    name: "Danh sách",
                    link: "/admin/payments"
                },
                // {
                //     id: "4.3",
                //     name: "Danh sách đã xóa",
                //     link: "/admin/payment/trash"
                // },
            ]
        },
        {
            id: "6",
            name: "Banner",
            link: "/admin/banners",
            svg: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 256 256"><path fill="#000000" d="m131.79 69.65l-43.63 96a4 4 0 0 1-3.64 2.35H28.23a8.2 8.2 0 0 1-6.58-3.13a8 8 0 0 1 .43-10.25L57.19 116L22.08 77.38a8 8 0 0 1-.43-10.26A8.22 8.22 0 0 1 28.23 64h99.92a4 4 0 0 1 3.64 5.65m105.77-27.41a8.3 8.3 0 0 0-5.79-2.24H168a8 8 0 0 0-7.28 4.69l-42.57 93.65a4 4 0 0 0 3.64 5.66h57.79l-34.86 76.69a8 8 0 1 0 14.56 6.62l80-176a8 8 0 0 0-1.72-9.07"/></svg>,
            sub_menu: [
                {
                    id: "6.1",
                    name: "Thêm",
                    link: "/admin/banners/create",
                },
                {
                    id: "6.2",
                    name: "Danh sách",
                    link: "/admin/banners",
                },
            ]
        },
        // {
        //     id: "6",
        //     name: "Tin tức",
        //     link: "/admin/news",
        //     svg: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><path fill="currentColor" d="M13.03 10c-.122 0-.255 0-.37.01c-.13.01-.3.036-.478.126a1.25 1.25 0 0 0-.546.547c-.09.176-.116.348-.127.478c-.01.114-.009.247-.009.369v1.19c0 .122 0 .255.01.37c.01.13.036.3.126.478c.12.235.311.426.547.546c.176.09.348.116.478.127c.114.01.247.009.369.009h1.94c.122 0 .255 0 .37-.01c.13-.01.3-.036.478-.126a1.25 1.25 0 0 0 .546-.546c.09-.177.116-.349.127-.479c.01-.114.009-.247.009-.369v-1.19c0-.122 0-.255-.01-.37a1.3 1.3 0 0 0-.126-.478a1.25 1.25 0 0 0-.546-.546a1.3 1.3 0 0 0-.479-.127A5 5 0 0 0 14.97 10zm-4.78.25a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5zm0 2.25a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5zm0 2.75a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5zm0 2.5a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5z" opacity=".5" /><path fill="currentColor" d="M17.83 2.25H6.17c-.535 0-.98 0-1.345.03c-.38.03-.736.098-1.073.27A2.75 2.75 0 0 0 2.55 3.752c-.172.337-.24.693-.27 1.073c-.03.365-.03.81-.03 1.345V21a.75.75 0 0 0 1.5 0V6.2c0-.572 0-.957.025-1.253c.023-.287.065-.424.111-.514a1.25 1.25 0 0 1 .547-.547c.09-.046.227-.088.514-.111c.296-.024.68-.025 1.253-.025h11.6c.572 0 .957 0 1.252.025c.288.023.425.065.515.111c.236.12.427.311.547.547c.046.09.088.227.111.514c.024.296.025.68.025 1.253V21a.75.75 0 0 0 1.5 0V6.17c0-.535 0-.98-.03-1.345c-.03-.38-.098-.736-.27-1.073a2.75 2.75 0 0 0-1.2-1.202c-.338-.172-.694-.24-1.074-.27c-.365-.03-.81-.03-1.345-.03" /><path fill="currentColor" d="M7.5 6.5a1 1 0 0 0 0 2h9a1 1 0 1 0 0-2z" /></svg>,
        //     sub_menu: [
        //         {
        //             id: "6.1",
        //             name: "Thêm",
        //             link: "/admin/news",
        //         },
        //         {
        //             id: "6.2",
        //             name: "Danh sách",
        //             link: "/admin/news",
        //         },
        //         {
        //             id: "6.3",
        //             name: "Danh sách đã xóa",
        //             link: "/admin/news/trash",
        //         },
        //     ]
        // },
        // {
        //     id: "7",
        //     name: "Bình luận tin tức",
        //     link: "/admin/comment-news",
        //     svg: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M14 22.5L11.2 19H6C5.44772 19 5 18.5523 5 18V7.10256C5 6.55028 5.44772 6.10256 6 6.10256H22C22.5523 6.10256 23 6.55028 23 7.10256V18C23 18.5523 22.5523 19 22 19H16.8L14 22.5ZM15.8387 17H21V8.10256H7V17H11.2H12.1613L14 19.2984L15.8387 17ZM2 2H19V4H3V15H1V3C1 2.44772 1.44772 2 2 2Z"></path></svg>,
        //     sub_menu: [
        //         {
        //             id: "7.2",
        //             name: "Danh sách",
        //             link: "/admin/comment-news",
        //         },
        //     ]
        // },
        // {
        //     id: "8",
        //     name: "Bình luận sản phẩm",
        //     link: "/admin/comment-products",
        //     svg: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 13.5h8m-8-5h4M6.099 19q-1.949-.192-2.927-1.172C2 16.657 2 14.771 2 11v-.5c0-3.771 0-5.657 1.172-6.828S6.229 2.5 10 2.5h4c3.771 0 5.657 0 6.828 1.172S22 6.729 22 10.5v.5c0 3.771 0 5.657-1.172 6.828S17.771 19 14 19c-.56.012-1.007.055-1.445.155c-1.199.276-2.309.89-3.405 1.424c-1.563.762-2.344 1.143-2.834.786c-.938-.698-.021-2.863.184-3.865" color="currentColor" /></svg>,
        //     sub_menu: [
        //         {
        //             id: "8.2",
        //             name: "Danh sách",
        //             link: "/admin/comment-products",
        //         },
        //     ]
        // },
        {
            id: "9",
            name: "Tài khoản",
            link: "/admin/accounts",
            svg: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 32 32"><path fill="currentColor" d="M16 4a5 5 0 1 1-5 5a5 5 0 0 1 5-5m0-2a7 7 0 1 0 7 7a7 7 0 0 0-7-7zm10 28h-2v-5a5 5 0 0 0-5-5h-6a5 5 0 0 0-5 5v5H6v-5a7 7 0 0 1 7-7h6a7 7 0 0 1 7 7z" /></svg>,
            sub_menu: [
                {
                    id: "9.1",
                    name: "Thêm",
                    link: "/admin/accounts/create",
                },
                {
                    id: "9.2",
                    name: "Danh sách",
                    link: "/admin/accounts",
                },
                {
                    id: "9.3",
                    name: "Danh sách đã xóa",
                    link: "/admin/accounts/trash",
                },
            ]
        },
        {
            id: "10",
            name: "Vai trò",
            link: "/admin/roles",
            svg: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 32 32"><path fill="currentColor" d="M28.07 21L22 15l6.07-6l1.43 1.41L24.86 15l4.64 4.59L28.07 21zM22 30h-2v-5a5 5 0 0 0-5-5H9a5 5 0 0 0-5 5v5H2v-5a7 7 0 0 1 7-7h6a7 7 0 0 1 7 7zM12 4a5 5 0 1 1-5 5a5 5 0 0 1 5-5m0-2a7 7 0 1 0 7 7a7 7 0 0 0-7-7z" /></svg>,
            sub_menu: [
                {
                    id: "10.1",
                    name: "Thêm",
                    link: "/admin/roles/create",
                },
                {
                    id: "10.2",
                    name: "Danh sách",
                    link: "/admin/roles",
                },
                {
                    id: "10.3",
                    name: "Danh sách đã xóa",
                    link: "/admin/roles/trash",
                },
            ]
        },
        // {
        //     id: "11",
        //     name: "Quyền hạn",
        //     link: "/admin/permissions",
        //     svg: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="4"><path strokeLinejoin="round" d="M20 10H6a2 2 0 0 0-2 2v26a2 2 0 0 0 2 2h36a2 2 0 0 0 2-2v-2.5" /><path d="M10 23h8m-8 8h24" /><circle cx="34" cy="16" r="6" strokeLinejoin="round" /><path strokeLinejoin="round" d="M44 28.419C42.047 24.602 38 22 34 22s-5.993 1.133-8.05 3" /></g></svg>,
        //     sub_menu: [
        //         {
        //             id: "11.1",
        //             name: "Thêm",
        //             link: "/admin/permissions/create",
        //         },
        //         {
        //             id: "11.2",
        //             name: "Danh sách",
        //             link: "/admin/permissions",
        //         },
        //         {
        //             id: "11.3",
        //             name: "Danh sách dã xóa",
        //             link: "/admin/permissions/trash",
        //         },
        //     ]
        // },
        // {
        //     id: "12",
        //     name: "Thống kê",
        //     link: "/admin/statisticals/revenue",
        //     svg: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" d="M22 22H2" /><path d="M21 22v-7.5a1.5 1.5 0 0 0-1.5-1.5h-3a1.5 1.5 0 0 0-1.5 1.5V22" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 22V9M9 22V5c0-1.414 0-2.121.44-2.56C9.878 2 10.585 2 12 2c1.414 0 2.121 0 2.56.44C15 2.878 15 3.585 15 5v0" /><path strokeLinecap="round" d="M9 22V9.5A1.5 1.5 0 0 0 7.5 8h-3A1.5 1.5 0 0 0 3 9.5V16m0 6v-2.25" /></g></svg>,
        //     sub_menu: [
        //         {
        //             id: "12.1",
        //             name: "Thống kê doanh thu",
        //             link: "/admin/statisticals/revenue",
        //         },
        //         {
        //             id: "12.2",
        //             name: "Hiệu suất sản phẩm theo danh mục",
        //             link: "/admin/statisticals/productper",
        //         },
        //     ]
        // },
        // {
        //     id: "13",
        //     name: "Banner",
        //     link: "/admin/banners",
        //     svg: <svg height={28} width={28} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><rect fill="none" /><polygon opacity="0.2" points="40 48 40 48 224 48 176 108 224 168 40 168 40 48" /><polyline fill="none" points="40 216 40 48 40 48 224 48 176 108 224 168 40 168" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /></svg>,
        //     sub_menu: [
        //         {
        //             id: "13.1",
        //             name: "Thêm",
        //             link: "/admin/banners/create",
        //         },
        //         {
        //             id: "13.2",
        //             name: "Danh sách",
        //             link: "/admin/banners",
        //         },
        //     ]
        // },
        // {
        //     id: "14",
        //     name: "Phiếu giảm giá",
        //     link: "/admin/vouchers",
        //     svg: <svg id="Glyph" width="28" height="28" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g data-name="Glyph" id="Glyph-2"><path d="M23,45a1,1,0,0,0-1,1v5a1,1,0,0,0,2,0V46A1,1,0,0,0,23,45Z" /><path d="M23,35a1,1,0,0,0-1,1v5a1,1,0,0,0,2,0V36A1,1,0,0,0,23,35Z" /><path d="M61,37a1,1,0,0,0,1-1V30a2.931,2.931,0,0,0-.61-1.79,3.625,3.625,0,0,0,.11-3.82l-2.22-3.85a1,1,0,0,0-1.37-.37,5.663,5.663,0,1,1-5.66-9.81,1.007,1.007,0,0,0,.36-1.37L49.95,4.37a2.8,2.8,0,0,0-3.8-1.02L5.2,27H5a3.009,3.009,0,0,0-3,3v6a1,1,0,0,0,1,1A6.5,6.5,0,0,1,3,50a1,1,0,0,0-1,1v5a4,4,0,0,0,4,4H58a4,4,0,0,0,4-4V51a1,1,0,0,0-1-1,6.5,6.5,0,0,1,0-13Zm-8.5,6.5A8.5,8.5,0,0,0,60,51.94V56a2.006,2.006,0,0,1-2,2H24V56a1,1,0,0,0-2,0v2H6a2.006,2.006,0,0,1-2-2V51.94A8.5,8.5,0,0,0,4,35.06V30a1,1,0,0,1,1-1H22v2a1,1,0,0,0,2,0V29H59a1,1,0,0,1,1,1v5.06A8.5,8.5,0,0,0,52.5,43.5Z" /><circle cx="34" cy="38" r="4" /><circle cx="46" cy="50" r="4" /><path d="M48.12,40.12,36.2,52.19a3.132,3.132,0,0,1-4.41.02A3.169,3.169,0,0,1,30.88,50a3.047,3.047,0,0,1,.93-2.2L43.88,35.87a3.1,3.1,0,0,1,4.24.01A3.027,3.027,0,0,1,48.12,40.12Z" /></g></svg>,
        //     sub_menu: [
        //         {
        //             id: "14.1",
        //             name: "Thêm",
        //             link: "/admin/vouchers/create",
        //         },
        //         {
        //             id: "14.2",
        //             name: "Danh sách",
        //             link: "/admin/vouchers",
        //         },
        //     ]
        // },
    ]
    return (
        <>
            <button
                onClick={toggeSidebarMobile}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 text-gray-600 hover:text-gray-900 cursor-pointer hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 rounded"
            >
                <svg
                    id="toggleSidebarMobileHamburger"
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                    ></path>
                </svg>
                <svg
                    id="toggleSidebarMobileClose"
                    className="w-6 h-6 hidden"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    ></path>
                </svg>
            </button>
            {
                sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black opacity-50 z-40"
                        onClick={toggeSidebarMobile}
                    ></div>
                )
            }
            <aside
                id="sidebar"
                className={`flex fixed z-40 h-full top-0 left-0 pt-16 lg:flex flex-col w-64 transition-width select-none duration-300
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
                aria-label="Sidebar"
            >
                <div className="relative flex-1 flex-col min-h-0 border-r border-gray-200 bg-white pt-0">
                    <div className="flex-1 h-screen flex flex-col pt-5 pb-20 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                        <div className="flex-1 px-3 bg-white divide-y space-y-1">
                            <ul className="space-y-2 pb-2">
                                <li>
                                    <form action="#" method="GET" className="lg:hidden">
                                        <label htmlFor="mobile-search" className="sr-only">Search</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg
                                                    className="w-5 h-5 text-gray-500"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                                                    />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                name="email"
                                                id="mobile-search"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-600 block w-full pl-10 p-2.5"
                                                placeholder="Search"
                                            />
                                        </div>
                                    </form>
                                </li>
                                {
                                    Menu.map((item) => (
                                        <li key={item.id}>
                                            <div className='flex justify-around items-center'>
                                                <Link to={item.link} className="text-base text-gray-900 font-normal rounded-lg flex items-center py-2 px-1.5 hover:bg-gray-100 group w-80">
                                                    {item.svg}
                                                    <span className="ml-3">{item.name}</span>
                                                </Link>
                                                {item.sub_menu &&
                                                    <span
                                                        onClick={() => toggleArrowDown(item.id)}
                                                        className='ml-3 rounded-lg hover:bg-gray-100 cursor-pointer'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="26" fill="currentColor"
                                                            style={{
                                                                transform: dropdownStates[item.id] ? "rotate(90deg)" : "rotate(0deg)",
                                                                transition: 'transform 0.2s ease-in-out',
                                                            }}
                                                        ><path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z"></path></svg></span>
                                                }
                                            </div>
                                            {
                                                item.sub_menu && dropdownStates[item.id] && (
                                                    <ul className="space-y-2 pb-2"
                                                        style={{ transition: 'transform 0.2s ease-in-out' }}>
                                                        {
                                                            item.sub_menu.map((subItem) => (
                                                                <li key={subItem.id}>
                                                                    <Link to={subItem.link} className="text-sm text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 group">
                                                                        <span className="ml-8">{subItem.name}</span>
                                                                    </Link>
                                                                </li>
                                                            ))
                                                        }
                                                    </ul>
                                                )
                                            }
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}