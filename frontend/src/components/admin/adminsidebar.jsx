import React, { useState, useRef } from 'react';

export const AdminSidebar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dropdownStates, setDropdownStates] = useState({});
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
            name: "Dashboard",
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
                    link: "/admin/categories/list"
                },
            ]
        },
        {
            id: "3",
            name: "Người dùng",
            link: "/admin/users",
            svg: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 32 32"><path fill="currentColor" d="M16 4a5 5 0 1 1-5 5a5 5 0 0 1 5-5m0-2a7 7 0 1 0 7 7a7 7 0 0 0-7-7zm10 28h-2v-5a5 5 0 0 0-5-5h-6a5 5 0 0 0-5 5v5H6v-5a7 7 0 0 1 7-7h6a7 7 0 0 1 7 7z"/></svg>,
            sub_menu: [
                {
                    id: "3.1",
                    name: "Thêm",
                    link: "/admin/users/add",
                },
                {
                    id: "3.2",
                    name: "Danh sách",
                    link: "/admin/users/list",
                },
            ]
        },
        {
            id: "4",
            name: "Vai trò",
            link: "/admin/roles",
            svg: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 32 32"><path fill="currentColor" d="M28.07 21L22 15l6.07-6l1.43 1.41L24.86 15l4.64 4.59L28.07 21zM22 30h-2v-5a5 5 0 0 0-5-5H9a5 5 0 0 0-5 5v5H2v-5a7 7 0 0 1 7-7h6a7 7 0 0 1 7 7zM12 4a5 5 0 1 1-5 5a5 5 0 0 1 5-5m0-2a7 7 0 1 0 7 7a7 7 0 0 0-7-7z"/></svg>,
            sub_menu: [
                {
                    id: "3.1",
                    name: "Thêm",
                    link: "/admin/roles/add",
                },
                {
                    id: "3.2",
                    name: "Danh sách",
                    link: "/admin/roles/list",
                },
            ]
        },
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
                className={`flex fixed z-50 h-full top-0 left-0 pt-16 lg:flex flex-col w-64 transition-width duration-300
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
                aria-label="Sidebar"
            >
                <div className="relative flex-1 flex-col min-h-0 border-r border-gray-200 bg-white pt-0">
                    <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
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
                                                <a href={item.link} className="text-base text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 group w-80">
                                                    {item.svg}
                                                    <span className="ml-3">{item.name}</span>
                                                </a>
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
                                                                    <a href={subItem.link} className="text-sm text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 group">
                                                                        <span className="ml-8">{subItem.name}</span>
                                                                    </a>
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
