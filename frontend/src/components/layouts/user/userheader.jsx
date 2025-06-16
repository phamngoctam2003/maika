import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { message, notification as Notification } from 'antd';
import { AuthService } from '@/services/api-auth';
import { AntNotification } from "@components/ui/notification";
import { useAuth } from '@/contexts/authcontext';
import { Loading } from '@components/loading/loading';
import { LoginGoogle } from '@components/LoginGoogle/LoginGoogle';
import Sidebar from '../../user/sidebar';
export const UserHeader = () => {
    const URL_IMG = import.meta.env.VITE_URL_IMG;
    const logoGoogle = (<svg className="hover:scale-125 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 128 128"><path fill="#fff" d="M44.59 4.21a63.28 63.28 0 0 0 4.33 120.9a67.6 67.6 0 0 0 32.36.35a57.13 57.13 0 0 0 25.9-13.46a57.44 57.44 0 0 0 16-26.26a74.33 74.33 0 0 0 1.61-33.58H65.27v24.69h34.47a29.72 29.72 0 0 1-12.66 19.52a36.16 36.16 0 0 1-13.93 5.5a41.29 41.29 0 0 1-15.1 0A37.16 37.16 0 0 1 44 95.74a39.3 39.3 0 0 1-14.5-19.42a38.31 38.31 0 0 1 0-24.63a39.25 39.25 0 0 1 9.18-14.91A37.17 37.17 0 0 1 76.13 27a34.28 34.28 0 0 1 13.64 8q5.83-5.8 11.64-11.63c2-2.09 4.18-4.08 6.15-6.22A61.22 61.22 0 0 0 87.2 4.59a64 64 0 0 0-42.61-.38z" /><path fill="#e33629" d="M44.59 4.21a64 64 0 0 1 42.61.37a61.22 61.22 0 0 1 20.35 12.62c-2 2.14-4.11 4.14-6.15 6.22Q95.58 29.23 89.77 35a34.28 34.28 0 0 0-13.64-8a37.17 37.17 0 0 0-37.46 9.74a39.25 39.25 0 0 0-9.18 14.91L8.76 35.6A63.53 63.53 0 0 1 44.59 4.21z" /><path fill="#f8bd00" d="M3.26 51.5a62.93 62.93 0 0 1 5.5-15.9l20.73 16.09a38.31 38.31 0 0 0 0 24.63q-10.36 8-20.73 16.08a63.33 63.33 0 0 1-5.5-40.9z" /><path fill="#587dbd" d="M65.27 52.15h59.52a74.33 74.33 0 0 1-1.61 33.58a57.44 57.44 0 0 1-16 26.26c-6.69-5.22-13.41-10.4-20.1-15.62a29.72 29.72 0 0 0 12.66-19.54H65.27c-.01-8.22 0-16.45 0-24.68z" /><path fill="#319f43" d="M8.75 92.4q10.37-8 20.73-16.08A39.3 39.3 0 0 0 44 95.74a37.16 37.16 0 0 0 14.08 6.08a41.29 41.29 0 0 0 15.1 0a36.16 36.16 0 0 0 13.93-5.5c6.69 5.22 13.41 10.4 20.1 15.62a57.13 57.13 0 0 1-25.9 13.47a67.6 67.6 0 0 1-32.36-.35a63 63 0 0 1-23-11.59A63.73 63.73 0 0 1 8.75 92.4z" /></svg>);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [loggedIn, setLoggedIn] = useState(null); // Thay đổi trạng thái đăng nhập
    const [isPopupActive, setIsPopupActive] = useState(false);
    const [isPopupLogin, setIsPopupLogin] = useState(true);

    const vobocloginRef = useRef(null);
    const linkdangnhapRef = useRef(null);
    const linkdangkyRef = useRef(null);
    const iconcloseRef = useRef(null);
    const btnCuasoRef = useRef(null);

    const { isAuthenticated, currentUser, setCurrentUser, roles, setRoles, permissions, token, setToken, setPermissions } = useAuth();

    const onFinish = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData(e.target);
            const res = isPopupLogin ? await handleLogin(formData) : await handleRegister(formData);

            if (res && res.access_token) {
                setLoginGoogle(res);
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

    console.log('isAuthenticated', isAuthenticated);
    console.log('currentUser', currentUser);

    const setLoginGoogle = (response) => {
        message.success("Đăng nhập thành công");
        const user = response.user;
        const permissions = response.user.permissions || [];
        const roles = response.user.roles || [];
        setCurrentUser(user);
        setPermissions(permissions);
        setRoles(roles);
        setIsPopupActive(false);
        setToken(response.access_token);
        if (permissions && permissions.length > 0 && !roles.includes('user')) {
            return navigate('/admin');
        } else {
            return navigate('/');
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
        setIsPopupActive(true);
    };

    const handleCloseClick = () => {
        setIsPopupActive(false);
        setIsPopupLogin(true);
    };

    useEffect(() => {
        (async () => {
            try {
                if (!isAuthenticated) {
                    setLoggedIn(null);
                } else {
                    setIsLoading(true);
                    setLoggedIn(true);
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
            setCurrentUser(null);
            setPermissions([]);
            setToken(null);
            setRoles([]);
        }
    }
    if (isLoading) return null;
    return (
        <>
            <header className=''>
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
                        <form>
                            <div className="box">
                                <div className="container-2">
                                    <input type="search" className="search" placeholder="Search..." />
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
                                <img src={
                                    currentUser?.image
                                        ? URL_IMG + currentUser.image
                                        : 'https://tse3.mm.bing.net/th?id=OIP.v6uzcpp3obKaXzgpB7hPpgHaHv&pid=Api&P=0&h=180'
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
                                                : 'https://tse3.mm.bing.net/th?id=OIP.v6uzcpp3obKaXzgpB7hPpgHaHv&pid=Api&P=0&h=180'
                                        }
                                        alt="Hình ảnh khách hàng"
                                    />
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
            <div className="header-mobile lg:hidden fixed w-full">
                <div>
                    <div className='flex justify-between items-center px-4 py-2'>
                        <div className='lg:hidden flex justify-start items-start'>
                            <Sidebar />
                        </div>
                        <div className='flex justify-center items-center'>
                            <div className="goicuoc">
                                <Link to="#"><button>Gói Cước</button></Link>
                            </div>
                            <div className="form-search">
                                <form>
                                    <div className="box">
                                        <div className="container-2">
                                            <input type="search" className="search" placeholder="Search..." />
                                            <span className="icon1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11 2C15.968 2 20 6.032 20 11C20 15.968 15.968 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2ZM11 18C14.8675 18 18 14.8675 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18ZM19.4853 18.0711L22.3137 20.8995L20.8995 22.3137L18.0711 19.4853L19.4853 18.0711Z"></path></svg></span>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="w-full px-4 select-none">
                        <nav className="overflow-x-auto whitespace-nowrap scrollbar-hide gap-6 flex font-semibold">
                            <Link to="sachdientu.php" className="pgp inline-block">Sách điện tử</Link>
                            <Link to="sachnoi.php" id="About" className="pgp inline-block">Sách nói</Link>
                            <Link to="sachhieusoi.php" className="pgp inline-block">Sách hiệu sồi</Link>
                            <Link to="sachdientu.phpc" className="pgp inline-block">Sách tóm tắt</Link>
                            <Link to="sachdientu.php" className="pgp inline-block">Sách điện tử</Link>
                            <Link to="sachnoi.php" id="About" className="pgp inline-block">Sách nói</Link>
                            <Link to="sachhieusoi.php" className="pgp inline-block">Sách hiệu sồi</Link>
                            <Link to="sachdientu.phpc" className="pgp inline-block">Sách tóm tắt</Link>
                            <Link to="sachdientu.php" className="pgp inline-block">Sách điện tử</Link>
                            <Link to="sachnoi.php" id="About" className="pgp inline-block">Sách nói</Link>
                            <Link to="sachhieusoi.php" className="pgp inline-block">Sách hiệu sồi</Link>
                            <Link to="sachdientu.phpc" className="pgp inline-block">Sách tóm tắt</Link>
                        </nav>
                    </div>
                </div>
            </div>
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
                                <div className="remember-forgot flex justify-end items-end">
                                    {/* <label className='cursor-pointer select-none'><input type="checkbox" className='cursor-pointer' />Lưu Đăng Nhập</label> */}

                                    <Link to="#" >Quên mật khẩu?</Link>
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
