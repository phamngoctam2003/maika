import { Button, Dropdown, notification } from 'antd';
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '@/contexts/authcontext';
import { AuthService } from '@/services/api-auth';
import { message } from "antd";
// import { NotificationService } from '@/services/api-notification';
const baseUrlImg = import.meta.env.VITE_URL_IMG;

export const AdminHeader = () => {
    const navigate = useNavigate();
    const [hasNotifications, setHasNotifications] = useState(false);
    const [countOrder, setCountOrder] = useState(0);
    const [products, setProducts] = useState([]);
    const { currentUser, setCurrentUser, setPermissions } = useAuth() || {};

    const handleLogout = async () => {
        try {
            await AuthService.logout();
            setCurrentUser(null);
            setPermissions([]);
            navigate('/');
            message.success("Đăng xuất thành công");
        } catch (error) {
            console.error("Lỗi khi đăng xuất:", error);
            message.error("Đăng xuất thất bại");
        }
    };

    // useEffect(() => {
    //     let isMounted = true;

    //     const fetchCountOrder = async () => {
    //         try {
    //             const order = await NotificationService.getCountOrder();
    //             const product = await NotificationService.getProduct();

    //             if (!isMounted) return;

    //             setCountOrder(order || 0);
    //             setProducts(Array.isArray(product) ? product : []);

    //             if ((order && order > 0) || (Array.isArray(product) && product.length > 0)) {
    //                 setHasNotifications(true);
    //                 notification.info({
    //                     message: 'Thông báo',
    //                     description: order > 0
    //                         ? `Có ${order} đơn hàng chưa được xử lý. Hãy kiểm tra ngay!`
    //                         : `Sản phẩm hết hàng, hãy xem và nhập lại.`,
    //                     duration: 5,
    //                 });
    //             } else {
    //                 setHasNotifications(false);
    //             }
    //         } catch (error) {
    //             console.error("Lỗi khi lấy dữ liệu thông báo:", error);
    //             if (isMounted) {
    //                 message.error("Không thể tải thông báo");
    //             }
    //         }
    //     };

    //     fetchCountOrder();
    //     return () => {
    //         isMounted = false;
    //     };
    // }, []);

    const buildNotificationMenu = () => {
        const items = [];

        if (countOrder > 0) {
            items.push({
                key: 'orders',
                label: (
                    <Link to="/admin/orders">
                        Có {countOrder} đơn hàng chưa được xử lý. Hãy kiểm tra ngay!
                    </Link>
                ),
            });
        }

        if (Array.isArray(products) && products.length > 0) {
            products.forEach((item) => {
                if (item && item.id && item.product_name) {
                    items.push({
                        key: `product-${item.id}`,
                        label: (
                            <Link to={`/admin/products/update/${item.id}`} className="flex">
                                Sản phẩm: <p className="w-24 font-bold mx-1 truncate">{item.product_name}</p> hết hàng, hãy xem và nhập lại
                            </Link>
                        ),
                    });
                }
            });
        }

        if (items.length === 0) {
            items.push({
                key: 'no-notifications',
                label: <span>Không có thông báo nào.</span>,
            });
        }

        return { items };
    };

    const buildUserMenu = () => {
        return {
            items: [
                {
                    key: "profile",
                    label: <span>{currentUser ? currentUser.fullname : 'Người dùng'}</span>,
                },
                {
                    key: "logout",
                    label: <span onClick={handleLogout} className="text-red-500">Đăng xuất</span>,
                },
            ],
        };
    };

    const menuNotifi = buildNotificationMenu();
    const menuUser = buildUserMenu();

    return (
        <nav className="bg-white border-b border-gray-200 fixed z-50 w-full">
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-start">
                        <Link to='/admin' className="font-bold text-2xl text-gray-900 text-right lg:block lg:pl-32 hidden">
                            Doashboard
                        </Link>
                    </div>
                    <div className="flex items-center">
                        <div className="flex items-center justify-center lg:hidden mr-4">
                            <span className="text-base font-normal text-gray-500 mr-1">
                                {
                                    currentUser && currentUser.avatar
                                        ? <img src={`${baseUrlImg}${currentUser.avatar}`} className="w-11 h-11 rounded-full object-cover" alt="Avatar" />
                                        : <img src="/images/home/lovepik-avatar-png-image_401708318_wh1200.png" className="w-11 h-11 rounded-full object-cover" alt="Default avatar" />
                                }
                            </span>
                            <Dropdown menu={menuUser} trigger={['click']} className="cursor-pointer">
                                <div className="flex items-center cursor-pointer">
                                    <span className="mr-2">{currentUser ? currentUser.fullname : 'Người dùng'}</span>
                                    <svg width="12" height="12" viewBox="0 0 16 16" className="" fill="currentColor">
                                        <path d="M12 6l-4 4-4-4"></path>
                                    </svg>
                                </div>
                            </Dropdown>
                        </div>
                        <button
                            id="toggleSidebarMobileSearch"
                            type="button"
                            className="lg:hidden text-gray-500 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg"
                        >
                            <Dropdown menu={menuNotifi} trigger={['click']} className="cursor-pointer">
                                <div className="relative">
                                    <svg
                                        data-name="Layer 1"
                                        id="Layer_1"
                                        width={28}
                                        height={28}
                                        viewBox="0 0 48 48"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <title />
                                        <path d="M40.62,28.34l-.87-.7A2,2,0,0,1,39,26.08V18A15,15,0,0,0,26.91,3.29a3,3,0,0,0-5.81,0A15,15,0,0,0,9,18v8.08a2,2,0,0,1-.75,1.56l-.87.7a9,9,0,0,0-3.38,7V37a4,4,0,0,0,4,4h8.26a8,8,0,0,0,15.47,0H40a4,4,0,0,0,4-4V35.36A9,9,0,0,0,40.62,28.34ZM24,43a4,4,0,0,1-3.44-2h6.89A4,4,0,0,1,24,43Zm16-6H8V35.36a5,5,0,0,1,1.88-3.9l.87-.7A6,6,0,0,0,13,26.08V18a11,11,0,0,1,22,0v8.08a6,6,0,0,0,2.25,4.69l.87.7A5,5,0,0,1,40,35.36Z" />
                                    </svg>
                                    {hasNotifications && (
                                        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
                                    )}
                                </div>
                            </Dropdown>
                        </button>
                        <div className="hidden lg:flex items-center gap-6">
                            <div className="flex items-center justify-center">
                                <span className="text-base font-normal text-gray-500 mr-5">
                                    {
                                        currentUser && currentUser.avatar
                                            ? <img src={`${baseUrlImg}${currentUser.avatar}`} className="w-11 h-11 rounded-full object-cover" alt="Avatar" />
                                            : <img src="/images/home/lovepik-avatar-png-image_401708318_wh1200.png" className="w-11 h-11 rounded-full object-cover" alt="Default avatar" />
                                    }
                                </span>
                                <Dropdown menu={menuUser} trigger={['click']} className="cursor-pointer">
                                    <div className="flex items-center cursor-pointer">
                                        <span className="mr-2">{currentUser ? currentUser.fullname : 'Người dùng'}</span>
                                        <svg width="12" height="12" viewBox="0 0 16 16" className="" fill="currentColor">
                                            <path d="M12 6l-4 4-4-4"></path>
                                        </svg>
                                    </div>
                                </Dropdown>
                            </div>
                            <div>
                                <Dropdown menu={menuNotifi} trigger={['click']} className="cursor-pointer">
                                    <div className="relative">
                                        <svg
                                            data-name="Layer 1"
                                            id="Layer_1"
                                            width={28}
                                            height={28}
                                            viewBox="0 0 48 48"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <title />
                                            <path d="M40.62,28.34l-.87-.7A2,2,0,0,1,39,26.08V18A15,15,0,0,0,26.91,3.29a3,3,0,0,0-5.81,0A15,15,0,0,0,9,18v8.08a2,2,0,0,1-.75,1.56l-.87.7a9,9,0,0,0-3.38,7V37a4,4,0,0,0,4,4h8.26a8,8,0,0,0,15.47,0H40a4,4,0,0,0,4-4V35.36A9,9,0,0,0,40.62,28.34ZM24,43a4,4,0,0,1-3.44-2h6.89A4,4,0,0,1,24,43Zm16-6H8V35.36a5,5,0,0,1,1.88-3.9l.87-.7A6,6,0,0,0,13,26.08V18a11,11,0,0,1,22,0v8.08a6,6,0,0,0,2.25,4.69l.87.7A5,5,0,0,1,40,35.36Z" />
                                        </svg>
                                        {hasNotifications && (
                                            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
                                        )}
                                    </div>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};