import { useState, useRef, useEffect } from 'react';
import MobileDetect from 'mobile-detect';
import { useNavigate, Link } from 'react-router-dom';
import { callLogin, checkAuth, calllogout, callRegister } from '../../services/api';
import { message, notification as Notification } from 'antd';
// import { AuthService } from '../../services/authservice';
export const UserHeader = () => {
    const navigate = useNavigate();
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [ismobile, setIsMobile] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));

    const [loggedIn, setLoggedIn] = useState(null); // Thay đổi trạng thái đăng nhập
    const [user, setUser] = useState(null); // Thay đổi thông tin người dùng
    const [isPopupActive, setIsPopupActive] = useState(false);
    const [isPopupLogin, setIsPopupLogin] = useState(true);

    const vobocloginRef = useRef(null);
    const linkdangnhapRef = useRef(null);
    const linkdangkyRef = useRef(null);
    const iconcloseRef = useRef(null);
    const btnCuasoRef = useRef(null);

    const toggleMobileMenu = () => {
        setShowMobileMenu(prevState => !prevState);
    };

    const toggleSearchBar = () => {
        setShowSearchBar(prevState => !prevState);
    };
    const onFinish = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData(e.target);
            const res = isPopupLogin ? await handleLogin(formData) : await handleRegister(formData);

            if (res && res.access_token) {
                localStorage.setItem('token', res.access_token);
                setIsPopupActive(false);
                setToken(res.access_token);
                setUser(res.user);
                if (res.user.role === 'admin' || res.user.role === 'editor' || res.user.role === 'moderator') {
                    navigate('/admin');
                }
                message.success((isPopupLogin) ? 'Đăng nhập tài khoản thành công.' : 'Đăng ký, đăng nhập tài khoản thành công.');
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

    const handleLogin = async (formData) => {
        const email = formData.get('email');
        const password = formData.get('password');
        return await callLogin(email, password);
    };

    const handleRegister = async (formData) => {
        const objectData = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            password: formData.get('password'),
            password_confirmation: formData.get('password_confirmation'),
        }
        return await callRegister(objectData);
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
        setIsPopupActive(true);
    };

    const handleCloseClick = () => {
        setIsPopupActive(false);
        setIsPopupLogin(true);
    };
    console.log(user);
    useEffect(() => {
        // Lấy thông tin userAgent
        const md = new MobileDetect(window.navigator.userAgent);

        // Kiểm tra nếu thiết bị là di động
        if (md.mobile()) {
            setIsMobile(true);
            console.log('Đây là thiết bị di động');
        } else {
            setIsMobile(false);
            console.log('Đây là thiết bị máy tính');
        }
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const response = await checkAuth();
                const { user } = response;
                if (user === null) {
                    setLoggedIn(null);
                    console.log("Người dùng chưa đăng nhập");
                } else {
                    setIsLoading(true);
                    setUser(user);
                    setLoggedIn(true);
                }
            } catch (error) {
                setToken(null);
                localStorage.removeItem('token');
                console.log("Người dùng chưa đăng nhập", error);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [token]);

    const handleLogout = async () => {
        try {
            const response = await calllogout();
            (response) ? message.success('Đã đăng xuất') : message.error('Đăng xuất thất bại!');
        } catch (error) {
            console.error('Lỗi khi đăng xuất', error);
        } finally {
            localStorage.removeItem('token');
            setLoggedIn(null);
            setUser(null);
            setToken(null);
        }
    }
    console.log(ismobile)
    if (isLoading) return null;
    return (
        <>
            {ismobile ? (
                <header className="mobile-header">
                    <div className="mobile-top-bar">
                        <Link to="/">
                            <h2 className="logomaika">MAIKA</h2>
                        </Link>

                        <div className="mobile-controls">
                            <div className="search-toggle" onClick={toggleSearchBar}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M11 2C15.968 2 20 6.032 20 11C20 15.968 15.968 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2ZM11 18C14.8675 18 18 14.8675 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18ZM19.4853 18.0711L22.3137 20.8995L20.8995 22.3137L18.0711 19.4853L19.4853 18.0711Z"></path>
                                </svg>
                            </div>

                            <div className="menu-toggle" onClick={toggleMobileMenu}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Expandable Search Bar */}
                    {showSearchBar && (
                        <div className="mobile-search-bar">
                            <form id="mobile-form-search">
                                <div className="mobile-search-container">
                                    <input type="search" id="mobile-search" placeholder="Tìm kiếm..." />
                                    <button type="submit" className="search-submit">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M11 2C15.968 2 20 6.032 20 11C20 15.968 15.968 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2ZM11 18C14.8675 18 18 14.8675 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18ZM19.4853 18.0711L22.3137 20.8995L20.8995 22.3137L18.0711 19.4853L19.4853 18.0711Z"></path>
                                        </svg>
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div id="countdown" className="mobile-countdown"></div>

                    {/* Mobile Navigation */}
                    {showMobileMenu && (
                        <div className="mobile-menu">
                            <nav className="mobile-navigation">
                                <Link to="sachdientu.php" className="mobile-nav-item">
                                    <div className="mobile-nav-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M21 4H3C2.44772 4 2 4.44772 2 5V19C2 19.5523 2.44772 20 3 20H21C21.5523 20 22 19.5523 22 19V5C22 4.44772 21.5523 4 21 4ZM20 17H4V7H20V17Z"></path>
                                        </svg>
                                    </div>
                                    <span>Sách điện tử</span>
                                </Link>

                                <Link to="sachnoi.php" className="mobile-nav-item">
                                    <div className="mobile-nav-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M21 8C22.1046 8 23 8.89543 23 10V14C23 15.1046 22.1046 16 21 16H19.9381C19.446 19.9463 16.0796 23 12 23V21C15.3137 21 18 18.3137 18 15V9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9V16H3C1.89543 16 1 15.1046 1 14V10C1 8.89543 1.89543 8 3 8H4.06189C4.55399 4.05369 7.92038 1 12 1C16.0796 1 19.446 4.05369 19.9381 8H21Z"></path>
                                        </svg>
                                    </div>
                                    <span>Sách nói</span>
                                </Link>

                                <Link to="sachhieusoi.php" className="mobile-nav-item">
                                    <div className="mobile-nav-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2.5L20.4393 11.1346C20.8762 11.5853 21.1071 12.1836 21.0831 12.7971C21.0592 13.4106 20.7826 13.9905 20.3101 14.4066C19.7267 14.916 18.9885 15.1017 18.2476 14.9205C17.5066 14.7393 16.8713 14.2113 16.5006 13.5L15 11L16 21H8L9 11L7.4994 13.5C7.12869 14.2113 6.49335 14.7393 5.7524 14.9205C5.01146 15.1017 4.27327 14.916 3.68991 14.4066C3.21745 13.9905 2.94078 13.4106 2.91686 12.7971C2.89295 12.1836 3.12381 11.5853 3.56066 11.1346L12 2.5Z"></path>
                                        </svg>
                                    </div>
                                    <span>Sách hiệu sồi</span>
                                </Link>

                                <Link to="sachtomtat.php" className="mobile-nav-item">
                                    <div className="mobile-nav-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M2 3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V3.9934ZM11 5H4V19H11V5ZM13 5V19H20V5H13ZM14 7H19V9H14V7ZM14 10H19V12H14V10Z"></path>
                                        </svg>
                                    </div>
                                    <span>Sách tóm tắt</span>
                                </Link>

                                <Link to="#" className="mobile-nav-item mobile-packages">
                                    <div className="mobile-nav-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM8.5 14H14.5L15.5 15H7.5L8.5 14ZM7.5 12H15.5L16.5 13H6.5L7.5 12ZM6.5 10H16.5L17.5 11H5.5L6.5 10Z"></path>
                                        </svg>
                                    </div>
                                    <span>Gói Cước</span>
                                </Link>
                            </nav>

                            {/* User Account Section */}
                            {loggedIn ? (
                                <div className="mobile-user-section">
                                    <div className="mobile-user-info">
                                        <img
                                            src={user.image || 'img/Screenshot 2024-04-01 153617.png'}
                                            alt="Hình ảnh khách hàng"
                                            className="mobile-user-avatar"
                                        />
                                        <p className="mobile-user-name">{user.fullName}</p>
                                    </div>

                                    <Link to="#" className="mobile-membership-button">
                                        Trở thành hội viên
                                    </Link>

                                    <div className="mobile-account-options">
                                        <Link to="#" className="mobile-account-option">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                                <path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13Z"></path>
                                            </svg>
                                            <span>Quản lý tài khoản</span>
                                        </Link>

                                        <Link to="tusach.php" className="mobile-account-option">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                                <path d="M4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H14C14.5523 21 15 20.5523 15 20V15.2973L15.9995 19.9996C16.1143 20.5398 16.6454 20.8847 17.1856 20.7699L21.0982 19.9382C21.6384 19.8234 21.9832 19.2924 21.8684 18.7522L18.9576 5.0581C18.8428 4.51788 18.3118 4.17304 17.7716 4.28786L14.9927 4.87853C14.9328 4.38353 14.5112 4 14 4H10C10 3.44772 9.55228 3 9 3H4ZM10 6H13V14H10V6ZM10 19V16H13V19H10ZM8 5V15H5V5H8ZM8 17V19H5V17H8ZM17.3321 16.6496L19.2884 16.2338L19.7042 18.1898L17.7479 18.6057L17.3321 16.6496ZM16.9163 14.6933L15.253 6.86789L17.2092 6.45207L18.8726 14.2775L16.9163 14.6933Z"></path>
                                            </svg>
                                            <span>Tủ sách cá nhân</span>
                                        </Link>

                                        <Link to="lich_su.php" className="mobile-account-option">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                                <path d="M2 3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V3.9934ZM11 5H4V19H11V5ZM13 5V19H20V5H13ZM14 7H19V9H14V7ZM14 10H19V12H14V10Z"></path>
                                            </svg>
                                            <span>Lịch sử đọc sách</span>
                                        </Link>

                                        <Link to="#" className="mobile-account-option">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                                <path d="M21 8C22.1046 8 23 8.89543 23 10V14C23 15.1046 22.1046 16 21 16H19.9381C19.446 19.9463 16.0796 23 12 23V21C15.3137 21 18 18.3137 18 15V9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9V16H3C1.89543 16 1 15.1046 1 14V10C1 8.89543 1.89543 8 3 8H4.06189C4.55399 4.05369 7.92038 1 12 1C16.0796 1 19.446 4.05369 19.9381 8H21ZM7.75944 15.7849L8.81958 14.0887C9.74161 14.6662 10.8318 15 12 15C13.1682 15 14.2584 14.6662 15.1804 14.0887L16.2406 15.7849C15.0112 16.5549 13.5576 17 12 17C10.4424 17 8.98882 16.5549 7.75944 15.7849Z"></path>
                                            </svg>
                                            <span>Hỗ trợ khách hàng</span>
                                        </Link>

                                        <Link onClick={handleLogout} className="mobile-account-option">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                                <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C15.2713 2 18.1757 3.57078 20.0002 5.99923L17.2909 5.99931C15.8807 4.75499 14.0285 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C14.029 20 15.8816 19.2446 17.2919 17.9998L20.0009 17.9998C18.1765 20.4288 15.2717 22 12 22ZM19 16V13H11V11H19V8L24 12L19 16Z"></path>
                                            </svg>
                                            <span>Đăng xuất</span>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="mobile-login-section">
                                    <button
                                        className="mobile-login-button btnLogin-popup"
                                        onClick={handlePopupClick}
                                    >
                                        Đăng Nhập
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </header>
            ) : (
                <header>
                    <Link to="/">
                        <h2 className="logomaika">MAIKA</h2 >
                    </Link >
                    <div id="countdown"></div>
                    <div className="maka1">
                        <nav className="navigation">
                            <Link to="sachdientu.php" className="pgp">Sách điện tử</Link>
                            <Link to="sachnoi.php" id="About" className="pgp">Sách nói</Link>
                            <Link to="sachhieusoi.php" className="pgp">Sách hiệu sồi</Link>
                            <Link to="sachdientu.phpc" className="pgp">Sách tóm tắt</Link>
                        </nav>
                    </div>
                    <div className="nav1-c">
                        <div className="form-search">
                            <form id="form-">
                                <div className="box">
                                    <div className="container-2">
                                        <input type="search" id="search" placeholder="Search..." />
                                        <span className="icon1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11 2C15.968 2 20 6.032 20 11C20 15.968 15.968 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2ZM11 18C14.8675 18 18 14.8675 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18ZM19.4853 18.0711L22.3137 20.8995L20.8995 22.3137L18.0711 19.4853L19.4853 18.0711Z"></path></svg></span>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="goicuoc">
                            <Link to="#"><button>Gói Cước</button></Link>
                        </div>
                        <div className="form-submit">
                            {loggedIn ? (
                                <Link to="#">
                                    <img src="https://tse3.mm.bing.net/th?id=OIP.v6uzcpp3obKaXzgpB7hPpgHaHv&pid=Api&P=0&h=180" alt="Hình ảnh khách hàng" />
                                    <button className="down"></button>
                                </Link>
                            ) : (
                                <Link to="#"><button ref={btnCuasoRef} className="btnLogin-popup" onClick={handlePopupClick}>Đăng Nhập</button></Link>
                            )}

                            {loggedIn && (
                                <div className="admin-khachhang">
                                    <div className="taikhoan">
                                        <p>{user.fullName}</p>
                                        <img src={`${user.image || 'img/Screenshot 2024-04-01 153617.png'}`} alt="Hình ảnh khách hàng" />
                                    </div>
                                    <button className="hoivien-aac"><Link to="#">Trở thành hội viên</Link></button>
                                    <div className="flex-p">
                                        <div className="icon-flex">
                                            <Link to="#"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="25" height="25" fill="currentColor"><path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13Z"></path></svg>
                                                <p>Quản lý tài khoản</p></Link></div>
                                        <div className="icon-flex">
                                            <Link to="tusach.php"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="25" height="25" fill="currentColor"><path d="M4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H14C14.5523 21 15 20.5523 15 20V15.2973L15.9995 19.9996C16.1143 20.5398 16.6454 20.8847 17.1856 20.7699L21.0982 19.9382C21.6384 19.8234 21.9832 19.2924 21.8684 18.7522L18.9576 5.0581C18.8428 4.51788 18.3118 4.17304 17.7716 4.28786L14.9927 4.87853C14.9328 4.38353 14.5112 4 14 4H10C10 3.44772 9.55228 3 9 3H4ZM10 6H13V14H10V6ZM10 19V16H13V19H10ZM8 5V15H5V5H8ZM8 17V19H5V17H8ZM17.3321 16.6496L19.2884 16.2338L19.7042 18.1898L17.7479 18.6057L17.3321 16.6496ZM16.9163 14.6933L15.253 6.86789L17.2092 6.45207L18.8726 14.2775L16.9163 14.6933Z"></path></svg>
                                                <p>Tủ sách cá nhân</p></Link></div>
                                        <div className="icon-flex">
                                            <Link to="lich_su.php"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="25" height="25" fill="currentColor"><path d="M2 3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V3.9934ZM11 5H4V19H11V5ZM13 5V19H20V5H13ZM14 7H19V9H14V7ZM14 10H19V12H14V10Z"></path></svg>
                                                <p>Lịch sử đọc sách</p></Link></div>
                                        <div className="icon-flex">
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
            )}
            <div id="section1"></div>

            {/* Lớp overlay */}
            {isPopupActive && <div onClick={handleCloseClick} className="overlay"></div>}

            <div ref={vobocloginRef} className={`voboclogin ${isPopupActive ? 'active-popup' : ''}`}>
                <span ref={iconcloseRef} className="icon-close" onClick={handleCloseClick}></span>
                <div className="from-box login">
                    <h2>Đăng Nhập</h2>
                    <div className="form-logo1">
                        <div className="code-qr">
                            <img src="img/qr.png" alt="" />
                        </div>
                        {isPopupLogin && (
                            <form className="form-var" method="post" onSubmit={onFinish}>
                                <div className="input-box">
                                    <span className="icon"></span>
                                    <input type="email" name="email" />
                                    <label>Email</label>
                                </div>
                                <div className="input-box">
                                    <span className="icon"></span>
                                    <input type="password" name="password" />
                                    <label>Password</label>
                                </div>
                                <div className="remember-forgot">
                                    <label><input type="checkbox" />Lưu Đăng Nhập</label>
                                    <Link to="#">Quên mật khẩu?</Link>
                                </div>
                                <button type="submit" className="btn">Đăng Nhập</button>
                                <div className="login-register">
                                    <p>không có tài khoản? <Link to="#" ref={linkdangkyRef} className="linkdangky" onClick={handleSignupClick}>Đăng Ký</Link></p>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
                <div className="from-box register">
                    <h2 className="h2">Đăng Ký</h2>
                    <div className="form-logo1">
                        <div className="code-qr"><img src="img/qr.png" alt="" /></div>
                        {!isPopupLogin && (
                            <form onSubmit={onFinish}>
                                <div className="input-box">
                                    <span className="icon"></span>
                                    <input type="text" name="fullName" />
                                    <label>Họ Tên</label>
                                </div>
                                <div className="input-box">
                                    <span className="icon"></span>
                                    <input type="email" name="email" />
                                    <label>Email</label>
                                </div>
                                <div className="input-box">
                                    <span className="icon"></span>
                                    <input type="text" id="registerPhone" name="phone" />
                                    <label>Số điện thoại</label>
                                    <span id="phoneError" className="error-message"></span>
                                </div>
                                <div className="input-box">
                                    <span className="icon"></span>
                                    <input type="password" name="password" />
                                    <label>Password</label>
                                </div>
                                <div className="input-box">
                                    <span className="icon"></span>
                                    <input type="password" name="password_confirmation" />
                                    <label>Nhập lại password</label>
                                </div>
                                <div className="remember-forgot">
                                    <label><input type="checkbox" />Tôi đồng ý với tất cả điều khoản</label>
                                </div>
                                <button type="submit" className="btn">Đăng Ký</button>
                                <div className="login-register">
                                    <p>Bạn đã có tài khoản? <Link to="#" ref={linkdangnhapRef} className="linkdangnhap" onClick={handleLoginClick}>Đăng Nhập</Link></p>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
