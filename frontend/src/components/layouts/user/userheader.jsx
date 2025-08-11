import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link, Form } from 'react-router-dom';
import { message, notification as Notification } from 'antd';
import { AuthService } from '@/services/api-auth';
import { useAuth } from '@/contexts/authcontext';
import { Loading } from '@components/loading/loading';
import { LoginGoogle } from '@components/LoginGoogle/LoginGoogle';
import Sidebar from '../../user/sidebar/sidebar';
import HomeService from '@/services/users/api-home';
import FormSearch from '@components/user/form_search/form_search';
import ForgotPassword from '@components/auth/handleForgotPassword';
export const UserHeader = () => {
    const URL_IMG = import.meta.env.VITE_URL_IMG;
    const logoGoogle = (<svg className="hover:scale-125 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 128 128"><path fill="#fff" d="M44.59 4.21a63.28 63.28 0 0 0 4.33 120.9a67.6 67.6 0 0 0 32.36.35a57.13 57.13 0 0 0 25.9-13.46a57.44 57.44 0 0 0 16-26.26a74.33 74.33 0 0 0 1.61-33.58H65.27v24.69h34.47a29.72 29.72 0 0 1-12.66 19.52a36.16 36.16 0 0 1-13.93 5.5a41.29 41.29 0 0 1-15.1 0A37.16 37.16 0 0 1 44 95.74a39.3 39.3 0 0 1-14.5-19.42a38.31 38.31 0 0 1 0-24.63a39.25 39.25 0 0 1 9.18-14.91A37.17 37.17 0 0 1 76.13 27a34.28 34.28 0 0 1 13.64 8q5.83-5.8 11.64-11.63c2-2.09 4.18-4.08 6.15-6.22A61.22 61.22 0 0 0 87.2 4.59a64 64 0 0 0-42.61-.38z" /><path fill="#e33629" d="M44.59 4.21a64 64 0 0 1 42.61.37a61.22 61.22 0 0 1 20.35 12.62c-2 2.14-4.11 4.14-6.15 6.22Q95.58 29.23 89.77 35a34.28 34.28 0 0 0-13.64-8a37.17 37.17 0 0 0-37.46 9.74a39.25 39.25 0 0 0-9.18 14.91L8.76 35.6A63.53 63.53 0 0 1 44.59 4.21z" /><path fill="#f8bd00" d="M3.26 51.5a62.93 62.93 0 0 1 5.5-15.9l20.73 16.09a38.31 38.31 0 0 0 0 24.63q-10.36 8-20.73 16.08a63.33 63.33 0 0 1-5.5-40.9z" /><path fill="#587dbd" d="M65.27 52.15h59.52a74.33 74.33 0 0 1-1.61 33.58a57.44 57.44 0 0 1-16 26.26c-6.69-5.22-13.41-10.4-20.1-15.62a29.72 29.72 0 0 0 12.66-19.54H65.27c-.01-8.22 0-16.45 0-24.68z" /><path fill="#319f43" d="M8.75 92.4q10.37-8 20.73-16.08A39.3 39.3 0 0 0 44 95.74a37.16 37.16 0 0 0 14.08 6.08a41.29 41.29 0 0 0 15.1 0a36.16 36.16 0 0 0 13.93-5.5c6.69 5.22 13.41 10.4 20.1 15.62a57.13 57.13 0 0 1-25.9 13.47a67.6 67.6 0 0 1-32.36-.35a63 63 0 0 1-23-11.59A63.73 63.73 0 0 1 8.75 92.4z" /></svg>);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [ebookCategories, setEbookCategories] = useState([]);
    const [audiobookCategories, setAudiobookCategories] = useState([]);

    const [loggedIn, setLoggedIn] = useState(null); // Thay đổi trạng thái đăng nhập
    const [isPopupLogin, setIsPopupLogin] = useState(true);

    const vobocloginRef = useRef(null);
    const linkdangnhapRef = useRef(null);
    const linkdangkyRef = useRef(null);
    const iconcloseRef = useRef(null);
    const btnCuasoRef = useRef(null);

    const [isPopupActiveForgotPassword, setIsPopupActiveForgotPassword] = useState(false);

    const { isAuthenticated, currentUser, setCurrentUser, roles, setRoles, permissions, token, setToken, setPermissions, setIsAuthenticated, setUserPackages, setActivePackage, isPopupActiveLogin, setIsPopupActiveLogin, activePackage, setIsSupportOpenModal } = useAuth();

    const onFinish = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData(e.target);
            const res = isPopupLogin ? await handleLogin(formData) : await handleRegister(formData);

            if (res && res.access_token) {
                setLoginGoogle(res);
                e.target.reset(); // reset toàn bộ form về rỗng
                return true;
            } else {
                Notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res?.message || 'Tài khoản đã bị khóa!',
                    duration: 5,
                });
                return false;
            }
        } catch (error) {
            console.error('Lỗi khi xử lý đăng nhập/đăng ký:', error);
            Notification.error('Có lỗi xảy ra, vui lòng thử lại!');
            return false;
        }
    };

    const setLoginGoogle = (response) => {
        message.success("Đăng nhập thành công!");
        const user = response.user;
        const permissions = response.user.permissions || [];
        const roles = response.user.roles || [];
        setCurrentUser(user);
        setPermissions(permissions);
        setRoles(roles);
        setIsPopupActiveLogin(false);
        setIsAuthenticated(true);
        setToken(response.access_token);
        if (response.user_packages) {
            setUserPackages(response.user_packages);
        }
        // Set active package từ membership info
        if (response.membership && response.has_membership) {
            setActivePackage(response.membership);
        } else {
            setActivePackage(null);
        }
        if (permissions && permissions.length > 0 && !roles.includes('user')) {
            return navigate('/admin');
        }
    }
    const handleLogin = async (formData) => {
        const email = formData.get('email');
        const password = formData.get('password');
        return await AuthService.login(email, password);
    };

    const handleRegister = async (formData) => {
        const objectData = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            password: formData.get('password'),
            password_confirmation: formData.get('password_confirmation'),
        }
        return await AuthService.register(objectData);
    }

    const handleSignupClick = () => {
        vobocloginRef.current?.classList.add('active');
        setIsPopupLogin(false);
    };
    const handleLoginClick = () => {
        vobocloginRef.current?.classList.remove('active');
        setIsPopupLogin(true);
    };

    const handlePopupClick = () => {
        setIsPopupLogin(true);
        setIsPopupActiveLogin(true);
    };

    const handleCloseClick = () => {
        setIsPopupActiveLogin(false);
        setIsPopupLogin(true);
    };
    const handleCloseClickForgotPassword = () => {
        setIsPopupActiveForgotPassword(false);
    };

    useEffect(() => {
        (async () => {
            try {
                if (!isAuthenticated) {
                    setLoggedIn(null);
                } else {
                    setIsLoading(true);
                    setLoggedIn(true);
                    setIsPopupActiveLogin(false);
                }
            } catch (error) {
                console.error('Lỗi khi lấy thông tin người dùng', error);
            } finally {
                setIsLoading(false);

            }
        })();
    }, [token]);

    const handleLogout = async () => {
        try {
            await AuthService.logout();
            message.success('Đã đăng xuất');
            navigate('/');
        } catch (error) {
            console.error('Lỗi khi đăng xuất', error);
            message.error("Đăng xuất thất bại");
        } finally {
            setLoggedIn(null);
            setIsAuthenticated(false);
            setCurrentUser(null);
            setPermissions([]);
            setToken(null);
            setRoles([]);
        }
    }

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Gọi 2 API riêng biệt để lấy categories theo format
                // Tối ưu hơn vì backend đã filter sẵn, không cần xử lý ở frontend
                const [ebookResponse, audiobookResponse] = await Promise.all([
                    HomeService.getEbookCategories(),
                    HomeService.getAudiobookCategories()
                ]);

                // Cập nhật state với data đã được filter từ backend
                const ebookCats = ebookResponse.data || [];
                const audiobookCats = audiobookResponse.data || [];

                // Combine để có danh sách tổng (loại bỏ duplicate nếu có)
                const allCategoriesMap = new Map();
                [...ebookCats, ...audiobookCats].forEach(cat => allCategoriesMap.set(cat.id, cat));
                const allCategories = Array.from(allCategoriesMap.values());

                setCategories(allCategories);
                setEbookCategories(ebookCats);
                setAudiobookCategories(audiobookCats);
            } catch (error) {
                console.error('❌ Lỗi khi lấy categories:', error);
                // Fallback: Nếu API riêng lỗi, dùng API chung
                try {
                    const fallbackResponse = await HomeService.getCategories();
                    const fallbackCategories = fallbackResponse?.data || [];

                    setCategories(fallbackCategories);
                    setEbookCategories(fallbackCategories);
                    setAudiobookCategories(fallbackCategories);
                } catch (fallbackError) {
                    setCategories([]);
                    setEbookCategories([]);
                    setAudiobookCategories([]);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);
    if (isLoading) return null;
    return (
        <>
            <header className='px-12'>
                <Link to="/">
                    <h2 className="logomaika">MAIKA</h2 >
                </Link >
                <div className="maka1">
                    <nav className="navigation">
                        <div className="nav-item-dropdown">
                            <Link to="ebook" className="dropdown-trigger">
                                Sách điện tử
                                <svg className="dropdown-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 16L6 10H18L12 16Z" />
                                </svg>
                            </Link>
                            <div className="dropdown-menu">
                                <div className="dropdown-grid">
                                    {ebookCategories.length > 0 ? (
                                        ebookCategories.map((category) => (
                                            <Link
                                                key={`ebook-${category.id}`}
                                                to={`/ebook/category/${category.slug}`}
                                                className="dropdown-item"
                                                title={category.name}
                                            >
                                                {category.name}
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="dropdown-item text-gray-500">
                                            📚 Đang tải danh mục sách điện tử...
                                        </div>
                                    )}
                                </div>

                                <div className="explore-section">
                                    <h3 className="explore-title">Khám phá ngay</h3>
                                    <div className="explore-grid">
                                        <Link to="#" className="explore-item">
                                            <svg className="explore-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
                                            </svg>
                                            Sách mới nhất
                                        </Link>
                                        <Link to="#" className="explore-item">
                                            <svg className="explore-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" />
                                            </svg>
                                            Sách yêu thích
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Link to="/book-member" className="dropdown-trigger">Sách hội viên</Link>

                        <div className="nav-item-dropdown">
                            <Link to="sach-noi" className="dropdown-trigger">
                                Sách nói
                                <svg className="dropdown-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 16L6 10H18L12 16Z" />
                                </svg>
                            </Link>
                            <div className="dropdown-menu">
                                <div className="dropdown-grid">
                                    {audiobookCategories.length > 0 ? (
                                        audiobookCategories.map((category) => (
                                            <Link
                                                key={`sach-noi-${category.id}`}
                                                to={`/sach-noi/category/${category.slug}`}
                                                className="dropdown-item"
                                                title={category.description || category.name}
                                            >
                                                {category.name}
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="dropdown-item text-gray-500">
                                            🎧 Đang tải danh mục sách nói...
                                        </div>
                                    )}
                                </div>

                                <div className="explore-section">
                                    <h3 className="explore-title">Nghe ngay</h3>
                                    <div className="explore-grid">
                                        <Link to="#" className="explore-item">
                                            <svg className="explore-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M8 5.14V19.14L19 12.14L8 5.14Z" />
                                            </svg>
                                            Sách nói mới
                                        </Link>
                                        <Link to="#" className="explore-item">
                                            <svg className="explore-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M3 9V15H7L12 20V4L7 9H3Z" />
                                            </svg>
                                            Sách nói hay
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Link to="/book-free" className="dropdown-trigger">Sách miễn phí</Link>
                    </nav>
                </div>
                <div id="countdown"></div>

                <div className="nav1-c flex justify-between items-start gap-2 mt-2">
                    <FormSearch />
                    <Link to="package-plan" aria-current="page" className="mt-1 nuxt-link-exact-active nuxt-link-active flex items-center justify-center">
                        <div className="cursor-pointer bg-package border border-[#FC0] rounded-2xl px-2.5 py-[5.25px] bg-[rgba(255,204,0,0.16)] min-w-[92px] flex items-center">
                            <div className="w-4 h-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M11.0912 6.78786C11.2433 7.00395 11.5374 7.06431 11.7623 6.92565L14.3148 5.35251C14.3598 5.33578 14.4107 5.34331 14.4486 5.37254C14.4898 5.4043 14.5075 5.45516 14.497 5.50302L14.497 5.503L14.4953 5.51114L12.9055 13.3979C12.8917 13.4554 12.8385 13.5 12.7727 13.5H3.22729C3.16153 13.5 3.10829 13.4554 3.09446 13.3979L1.50469 5.51114L1.50476 5.51112L1.50298 5.50301C1.4925 5.45516 1.51022 5.4043 1.55138 5.37254C1.58926 5.34331 1.64024 5.33578 1.68523 5.35251L4.23766 6.92565C4.46264 7.06431 4.75668 7.00395 4.90882 6.78786L7.889 2.55533C7.91407 2.52132 7.95505 2.5 8 2.5C8.04495 2.5 8.08593 2.52132 8.111 2.55533L11.0912 6.78786Z" stroke="#FFCC00" strokeLinejoin="round" />
                                    <circle cx="8" cy="9" r="1.5" stroke="#FFCC00" />
                                </svg>
                            </div>
                            <p className="text-[13px] text-[#fc0] pl-[3px] whitespace-nowrap ">
                                Gói cước
                            </p>
                        </div>
                    </Link>
                    <div className="form-submit">
                        {loggedIn ? (
                            <Link to="#">
                                <img
                                    src={
                                        currentUser?.image
                                            ? URL_IMG + currentUser.image
                                            : '/images/png/image_user.png'
                                    } />
                                <button className="down"></button>
                            </Link>
                        ) : (
                            <Link to="#"><button ref={btnCuasoRef} className="btnLogin-popup" onClick={handlePopupClick}>Đăng Nhập</button></Link>
                        )}

                        {loggedIn && (
                            <div className="admin-khachhang">
                                <div className="taikhoan">
                                    <p>{currentUser?.fullName || ''}</p>
                                    <img
                                        src={
                                            currentUser?.image
                                                ? URL_IMG + currentUser.image
                                                : '/images/png/image_user.png'
                                        }
                                        alt="Hình ảnh khách hàng"
                                    />
                                </div>
                                {
                                    activePackage ? (
                                        <Link
                                            to={`/package-plan`}
                                            className="package-btn mt-2">
                                            <strong className='package-strong'>
                                                {activePackage.ends_at && (
                                                    <span className="">
                                                        Hội viên
                                                        {(() => {
                                                            const end = new Date(activePackage.ends_at.replace(" ", "T"));
                                                            const now = new Date();
                                                            const diff = Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
                                                            return `(Còn ${diff} ngày)`;
                                                        })()}
                                                    </span>
                                                )}
                                            </strong>
                                            <div id="container-stars">
                                                <div id="package-stars"></div>
                                            </div>
                                            <div id="package-glow">
                                                <div className="package-circle"></div>
                                                <div className="package-circle"></div>
                                            </div>
                                        </Link>
                                    ) : (
                                        <Link to='/package-plan' className="hoivien-aac mt-2">
                                            Trở thành hội viên
                                        </Link>
                                    )
                                }
                                <div className="flex-p">
                                    <div className="icon-flex">
                                        <Link to="/profile"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="25" height="25" fill="currentColor"><path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13Z"></path></svg>
                                            <p>Quản lý tài khoản</p></Link></div>
                                    <div className="icon-flex">
                                        <Link to="/profile/book-case"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="25" height="25" fill="currentColor"><path d="M4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H14C14.5523 21 15 20.5523 15 20V15.2973L15.9995 19.9996C16.1143 20.5398 16.6454 20.8847 17.1856 20.7699L21.0982 19.9382C21.6384 19.8234 21.9832 19.2924 21.8684 18.7522L18.9576 5.0581C18.8428 4.51788 18.3118 4.17304 17.7716 4.28786L14.9927 4.87853C14.9328 4.38353 14.5112 4 14 4H10C10 3.44772 9.55228 3 9 3H4ZM10 6H13V14H10V6ZM10 19V16H13V19H10ZM8 5V15H5V5H8ZM8 17V19H5V17H8ZM17.3321 16.6496L19.2884 16.2338L19.7042 18.1898L17.7479 18.6057L17.3321 16.6496ZM16.9163 14.6933L15.253 6.86789L17.2092 6.45207L18.8726 14.2775L16.9163 14.6933Z"></path></svg>
                                            <p>Tủ sách cá nhân</p></Link></div>
                                    <div className="icon-flex">
                                        <Link to="/profile/transaction-histories"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" color="currentColor"><path d="M13.5 15H6c-1.886 0-2.828 0-3.414-.586S2 12.886 2 11V7c0-1.886 0-2.828.586-3.414S4.114 3 6 3h12c1.886 0 2.828 0 3.414.586S22 5.114 22 7v5c0 .932 0 1.398-.152 1.765a2 2 0 0 1-1.083 1.083C20.398 15 19.932 15 19 15" /><path d="M14 9a2 2 0 1 1-4 0a2 2 0 0 1 4 0m-1 8a3 3 0 0 1 3-3v-2a3 3 0 0 1 3-3v5.5c0 2.335 0 3.502-.472 4.386a4 4 0 0 1-1.642 1.642C16.002 21 14.835 21 12.5 21H12c-1.864 0-2.796 0-3.53-.305a4 4 0 0 1-2.166-2.164C6 17.796 6 16.864 6 15" /></g></svg>
                                            <p>Lịch sử thanh toán</p></Link></div>
                                    <div onClick={() => setIsSupportOpenModal(true)} className="icon-flex">
                                        <Link to="#"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="25" height="25" fill="currentColor"><path d="M21 8C22.1046 8 23 8.89543 23 10V14C23 15.1046 22.1046 16 21 16H19.9381C19.446 19.9463 16.0796 23 12 23V21C15.3137 21 18 18.3137 18 15V9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9V16H3C1.89543 16 1 15.1046 1 14V10C1 8.89543 1.89543 8 3 8H4.06189C4.55399 4.05369 7.92038 1 12 1C16.0796 1 19.446 4.05369 19.9381 8H21ZM7.75944 15.7849L8.81958 14.0887C9.74161 14.6662 10.8318 15 12 15C13.1682 15 14.2584 14.6662 15.1804 14.0887L16.2406 15.7849C15.0112 16.5549 13.5576 17 12 17C10.4424 17 8.98882 16.5549 7.75944 15.7849Z"></path></svg>
                                            <p>Hỗ trợ khách hàng</p></Link></div>
                                    <div className="icon-flex">
                                        <Link onClick={handleLogout}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="25" height="25" fill="currentColor"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C15.2713 2 18.1757 3.57078 20.0002 5.99923L17.2909 5.99931C15.8807 4.75499 14.0285 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C14.029 20 15.8816 19.2446 17.2919 17.9998L20.0009 17.9998C18.1765 20.4288 15.2717 22 12 22ZM19 16V13H11V11H19V8L24 12L19 16Z"></path></svg>
                                            <p>Đăng xuất</p></Link></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header >
            <div className="header-mobile lg:hidden fixed w-full">
                <div>
                    <div className='flex justify-between items-center px-4 py-2'>
                        <div className='lg:hidden flex justify-start items-start'>
                            <Sidebar />
                        </div>
                        <div className='flex justify-center items-center gap-2'>
                            <FormSearch />
                            <Link to="package-plan" aria-current="page" className="mt-1 nuxt-link-exact-active nuxt-link-active flex items-center justify-center">
                                <div className="cursor-pointer bg-package border border-[#FC0] rounded-2xl px-2.5 py-[5.25px] bg-[rgba(255,204,0,0.16)] min-w-[92px] flex items-center">
                                    <div className="w-4 h-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M11.0912 6.78786C11.2433 7.00395 11.5374 7.06431 11.7623 6.92565L14.3148 5.35251C14.3598 5.33578 14.4107 5.34331 14.4486 5.37254C14.4898 5.4043 14.5075 5.45516 14.497 5.50302L14.497 5.503L14.4953 5.51114L12.9055 13.3979C12.8917 13.4554 12.8385 13.5 12.7727 13.5H3.22729C3.16153 13.5 3.10829 13.4554 3.09446 13.3979L1.50469 5.51114L1.50476 5.51112L1.50298 5.50301C1.4925 5.45516 1.51022 5.4043 1.55138 5.37254C1.58926 5.34331 1.64024 5.33578 1.68523 5.35251L4.23766 6.92565C4.46264 7.06431 4.75668 7.00395 4.90882 6.78786L7.889 2.55533C7.91407 2.52132 7.95505 2.5 8 2.5C8.04495 2.5 8.08593 2.52132 8.111 2.55533L11.0912 6.78786Z" stroke="#FFCC00" strokeLinejoin="round" />
                                            <circle cx="8" cy="9" r="1.5" stroke="#FFCC00" />
                                        </svg>
                                    </div>
                                    <p className="text-[13px] text-[#fc0] pl-[3px] whitespace-nowrap ">
                                        Gói cước
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="w-full px-4 select-none">
                        <nav className="overflow-x-auto whitespace-nowrap scrollbar-hide gap-6 flex font-semibold">
                            <Link to="ebook" className="pgp inline-block">Sách điện tử</Link>
                            <Link to="sach-noi" className="pgp inline-block">Sách nói</Link>
                            <Link to="book-member" className="pgp inline-block">Sách hội viên</Link>
                            <Link to="book-free" className="pgp inline-block">Sách miễn phí</Link>
                        </nav>
                    </div>
                </div>
            </div>
            <ForgotPassword isOpen={isPopupActiveForgotPassword} onClose={handleCloseClickForgotPassword} />
            <div id="section1"></div>
            {/* Lớp overlay */}
            {isPopupActiveLogin && <div onClick={handleCloseClick} className="overlay"></div>}

            <div ref={vobocloginRef} className={`voboclogin ${isPopupActiveLogin ? 'active-popup' : ''}`}>
                <span ref={iconcloseRef} className="icon-close" onClick={handleCloseClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><path fill="currentColor" d="M12 10.586l4.95-4.95 1.414 1.414L13.414 12l4.95 4.95-1.414 1.414L12 13.414l-4.95 4.95-1.414-1.414L10.586 12 5.636 7.05l1.414-1.414z" /></svg>
                </span>
                <div className="from-box login">
                    <h2>Đăng Nhập</h2>
                    <div className="form-logo1">
                        <div className="code-qr">
                            <img src="/images/png/maika-1024.png" alt="" />
                        </div>
                        {isPopupLogin && (
                            <form className="form-var" method="post" onSubmit={onFinish}>
                                <div className="input-box">
                                    <span className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 42 42"><path fill="currentColor" d="M40.5 31.5v-18S22.3 26.2 20.53 26.859C18.79 26.23.5 13.5.5 13.5v18c0 2.5.53 3 3 3h34c2.529 0 3-.439 3-3zm-.029-21.529c0-1.821-.531-2.471-2.971-2.471h-34c-2.51 0-3 .78-3 2.6l.03.28s18.069 12.44 20 13.12c2.04-.79 19.97-13.4 19.97-13.4l-.029-.129z" /></svg>
                                    </span>
                                    <input type="email" name="email" />
                                    <label>Email</label>
                                </div>
                                <div className="input-box">
                                    <span className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 15 15"><path fill="currentColor" d="M11 11h-1v-1h1v1Zm-3 0h1v-1H8v1Zm5 0h-1v-1h1v1Z" /><path fill="currentColor" fillRule="evenodd" d="M3 6V3.5a3.5 3.5 0 1 1 7 0V6h1.5A1.5 1.5 0 0 1 13 7.5v.55a2.5 2.5 0 0 1 0 4.9v.55a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 0 13.5v-6A1.5 1.5 0 0 1 1.5 6H3Zm1-2.5a2.5 2.5 0 0 1 5 0V6H4V3.5ZM8.5 9a1.5 1.5 0 1 0 0 3h4a1.5 1.5 0 0 0 0-3h-4Z" clipRule="evenodd" /></svg>
                                    </span>
                                    <input type="password" name="password" />
                                    <label>Password</label>
                                </div>
                                <div className="remember-forgot flex justify-end items-end">
                                    {/* <label className='cursor-pointer select-none'><input type="checkbox" className='cursor-pointer' />Lưu Đăng Nhập</label> */}

                                    <p className='cursor-pointer select-none' onClick={() => setIsPopupActiveForgotPassword(true)} >
                                        Quên mật khẩu?
                                    </p>
                                </div>
                                <button type="submit" className="btn">Đăng Nhập</button>
                                <div className="login-register mt-6">
                                    <p>Không có tài khoản? <Link to="#" ref={linkdangkyRef} className="linkdangky" onClick={handleSignupClick}>Đăng Ký</Link></p>
                                </div>
                                <div className="flex items-center">
                                    <hr className="flex-grow border-t border-gray-300" />
                                    <span className="px-3 text-gray-500">hoặc</span>
                                    <hr className="flex-grow border-t border-gray-300" />
                                </div>
                                <div className="w-full flex items-center justify-center px-20">
                                    <LoginGoogle onSuccess={setLoginGoogle} setLoading={setLoading} logoGoogle={logoGoogle} />
                                </div>
                            </form>
                        )}
                    </div>
                </div>
                <div className="from-box register">
                    <h2 className="h2">Đăng Ký</h2>
                    <div className="form-logo1">
                        <div className="code-qr">
                            <img src="/images/png/maika-1024.png" alt="" />
                        </div>
                        {!isPopupLogin && (
                            <form onSubmit={onFinish}>
                                <div className="input-box">
                                    <span className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="25" height="25" fill="currentColor"><path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13Z"></path></svg>
                                    </span>
                                    <input type="text" name="fullName" />
                                    <label>Họ Tên</label>
                                </div>
                                <div className="input-box">
                                    <span className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 42 42"><path fill="currentColor" d="M40.5 31.5v-18S22.3 26.2 20.53 26.859C18.79 26.23.5 13.5.5 13.5v18c0 2.5.53 3 3 3h34c2.529 0 3-.439 3-3zm-.029-21.529c0-1.821-.531-2.471-2.971-2.471h-34c-2.51 0-3 .78-3 2.6l.03.28s18.069 12.44 20 13.12c2.04-.79 19.97-13.4 19.97-13.4l-.029-.129z" /></svg>
                                    </span>
                                    <input type="email" name="email" />
                                    <label>Email</label>
                                </div>
                                <div className="input-box">
                                    <span className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 15 15"><path fill="currentColor" d="M11 11h-1v-1h1v1Zm-3 0h1v-1H8v1Zm5 0h-1v-1h1v1Z" /><path fill="currentColor" fillRule="evenodd" d="M3 6V3.5a3.5 3.5 0 1 1 7 0V6h1.5A1.5 1.5 0 0 1 13 7.5v.55a2.5 2.5 0 0 1 0 4.9v.55a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 0 13.5v-6A1.5 1.5 0 0 1 1.5 6H3Zm1-2.5a2.5 2.5 0 0 1 5 0V6H4V3.5ZM8.5 9a1.5 1.5 0 1 0 0 3h4a1.5 1.5 0 0 0 0-3h-4Z" clipRule="evenodd" /></svg>
                                    </span>
                                    <input type="password" name="password" />
                                    <label>Password</label>
                                </div>
                                <div className="input-box">
                                    <span className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 15 15"><path fill="currentColor" d="M11 11h-1v-1h1v1Zm-3 0h1v-1H8v1Zm5 0h-1v-1h1v1Z" /><path fill="currentColor" fillRule="evenodd" d="M3 6V3.5a3.5 3.5 0 1 1 7 0V6h1.5A1.5 1.5 0 0 1 13 7.5v.55a2.5 2.5 0 0 1 0 4.9v.55a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 0 13.5v-6A1.5 1.5 0 0 1 1.5 6H3Zm1-2.5a2.5 2.5 0 0 1 5 0V6H4V3.5ZM8.5 9a1.5 1.5 0 1 0 0 3h4a1.5 1.5 0 0 0 0-3h-4Z" clipRule="evenodd" /></svg>
                                    </span>
                                    <input type="password" name="password_confirmation" />
                                    <label>Nhập lại password</label>
                                </div>
                                {/* <div className="remember-forgot">
                                    <label><input type="checkbox" />Tôi đồng ý với tất cả điều khoản</label>
                                </div> */}
                                <button type="submit" className="btn">Đăng Ký</button>
                                <div className="login-register mt-2">
                                    <p>Bạn đã có tài khoản? <Link to="#" ref={linkdangnhapRef} className="linkdangnhap" onClick={handleLoginClick}>Đăng Nhập</Link></p>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
            <Loading isLoading={loading} />
        </>
    );
};
