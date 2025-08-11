import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loading } from '@components/loading/loading';
import { LoginGoogle } from '@components/LoginGoogle/LoginGoogle';
import { AntNotification } from "@components/global/notification";
import { message } from 'antd';
import { AuthService } from '@/services/api-auth';
import { useAuth } from '@/contexts/authcontext';
import ForgotPassword from '@components/auth/handleForgotPassword';

export const LoginModal = ({
    onLoginSuccess,
    isOpen,
    showPassword,
    setShowPassword,
    closeAllModals,
    openRegisterModal,
}) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isPopupActiveForgotPassword, setIsPopupActiveForgotPassword] = useState(false);
    const { setCurrentUser, setToken, setPermissions, setRoles, setIsAuthenticated, setUserPackages, setActivePackage } = useAuth();

    const logoGoogle = (<svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>);

    const onFinish = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData(e.target);
            const email = formData.get('email');
            const password = formData.get('password');
            const res = await AuthService.login(email, password);

            if (res && res.access_token) {

                setLoginGoogle(res);
                return true;
            } else {
                AntNotification.showNotification("Đăng nhập thất bại", res.message, "error");
                return false;
            }
        } catch (error) {
            console.error('Lỗi khi xử lý đăng nhập/đăng ký:', error);
            AntNotification.handleError(error);
            return false;
        }
    };

    const setLoginGoogle = (response) => {
        if (!response || !response.user) {
            message.error("Đăng nhập thất bại, vui lòng thử lại sau");
            return;
        }
        if (!response.access_token) {
            message.error("Không nhận được token, vui lòng thử lại sau");
            return;
        }
        message.success("Đăng nhập thành công");
        const user = response.user;
        const permissions = response.user.permissions || [];
        const roles = response.user.roles || [];
        setCurrentUser(user);
        setPermissions(permissions);
        setToken(response.access_token);
        setRoles(roles);
        setIsAuthenticated(true);
        closeAllModals();
        if (response.has_membership) {
            setUserPackages(response.has_membership);
        }
        if (response.membership && response.has_membership) {
            setActivePackage(response.membership);
        } else {
            setActivePackage(null);
        }
        if (onLoginSuccess) onLoginSuccess();
        if (permissions && permissions.length > 0) {
            return navigate('/admin');
        } else {
            return navigate('/');
        }
    }
    const handleCloseClickForgotPassword = () => {
        setIsPopupActiveForgotPassword(false);
    };

    if (!isOpen) return null;
    return (
        <div className={`z-[21] fixed left-0 top-0 h-full w-full bg-gray-900 text-white transform transition-transform duration-300 ease-in-out overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
            <div className="bg-gray-900 w-full relative">

                {/* Modal Content */}
                <div className="relative z-20 p-6">
                    {/* Close Button */}
                    <button
                        onClick={closeAllModals}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                    >
                        <span className="w-24 h-24">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 1024 1024"><path fill="currentColor" d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504L738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512L828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496L285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512L195.2 285.696a64 64 0 0 1 0-90.496z" /></svg>
                        </span>
                    </button>

                    {/* Support Badge */}
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-900">HT</span>
                        </div>
                        <span className="text-white text-sm">Hỗ trợ</span>
                    </div>

                    {/* WAKA Logo */}
                    <h1 className="text-4xl font-bold text-white text-center mb-2">MAIKA</h1>
                    <p className="text-gray-300 text-center text-sm mb-8">
                        Đăng nhập để đồng bộ dữ liệu của tài khoản trên nhiều thiết bị
                    </p>

                    {/* Login Form */}
                    <form onSubmit={onFinish} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                name="email"
                                placeholder="Email hoặc Số điện thoại"
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                            />
                        </div>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Mật khẩu"
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                                {showPassword ?
                                    <span className="w-24 h-24">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 1200 1200"><path fill="currentColor" d="M669.727 273.516c-22.891-2.476-46.15-3.895-69.727-4.248c-103.025.457-209.823 25.517-310.913 73.536c-75.058 37.122-148.173 89.529-211.67 154.174C46.232 529.978 6.431 577.76 0 628.74c.76 44.162 48.153 98.67 77.417 131.764c59.543 62.106 130.754 113.013 211.67 154.174c2.75 1.335 5.51 2.654 8.276 3.955l-75.072 131.102l102.005 60.286l551.416-960.033l-98.186-60.008l-107.799 183.536zm232.836 65.479l-74.927 129.857c34.47 44.782 54.932 100.006 54.932 159.888c0 149.257-126.522 270.264-282.642 270.264c-6.749 0-13.29-.728-19.922-1.172l-49.585 85.84c22.868 2.449 45.99 4.233 69.58 4.541c103.123-.463 209.861-25.812 310.84-73.535c75.058-37.122 148.246-89.529 211.743-154.174c31.186-32.999 70.985-80.782 77.417-131.764c-.76-44.161-48.153-98.669-77.417-131.763c-59.543-62.106-130.827-113.013-211.743-154.175c-2.731-1.324-5.527-2.515-8.276-3.807zm-302.636 19.483c6.846 0 13.638.274 20.361.732l-58.081 100.561c-81.514 16.526-142.676 85.88-142.676 168.897c0 20.854 3.841 40.819 10.913 59.325c.008.021-.008.053 0 .074l-58.228 100.854c-34.551-44.823-54.932-100.229-54.932-160.182c.001-149.255 126.524-270.262 282.643-270.261zm168.969 212.035L638.013 797.271c81.076-16.837 141.797-85.875 141.797-168.603c0-20.474-4.086-39.939-10.914-58.155z" /></svg>
                                    </span> :
                                    <span className="w-24 h-24">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 1200 1200"><path fill="currentColor" d="M779.843 599.925c0 95.331-80.664 172.612-180.169 172.612c-99.504 0-180.168-77.281-180.168-172.612c0-95.332 80.664-172.612 180.168-172.612c99.505-.001 180.169 77.281 180.169 172.612zM600 240.521c-103.025.457-209.814 25.538-310.904 73.557C214.038 351.2 140.89 403.574 77.394 468.219C46.208 501.218 6.431 549 0 599.981c.76 44.161 48.13 98.669 77.394 131.763c59.543 62.106 130.786 113.018 211.702 154.179C383.367 931.674 487.712 958.015 600 959.48c103.123-.464 209.888-25.834 310.866-73.557c75.058-37.122 148.243-89.534 211.74-154.179c31.185-32.999 70.962-80.782 77.394-131.763c-.76-44.161-48.13-98.671-77.394-131.764c-59.543-62.106-130.824-112.979-211.74-154.141C816.644 268.36 712.042 242.2 600 240.521zm-.076 89.248c156.119 0 282.675 120.994 282.675 270.251c0 149.256-126.556 270.25-282.675 270.25S317.249 749.275 317.249 600.02c0-149.257 126.556-270.251 282.675-270.251z" /></svg>
                                    </span>}
                            </button>
                        </div>

                        <button
                            className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
                        >
                            ĐĂNG NHẬP
                        </button>
                    </form>

                    {/* Links */}
                    <div className="flex justify-between mt-6 text-sm">
                        <button
                            onClick={openRegisterModal}
                            className="text-green-400 hover:text-green-300 transition-colors"
                        >
                            Đăng ký ngay
                        </button>
                        <ForgotPassword isOpen={isPopupActiveForgotPassword} onClose={handleCloseClickForgotPassword} />
                        <p
                        onClick={() => setIsPopupActiveForgotPassword(true)}
                        className="text-green-400 hover:text-green-300 transition-colors">
                            Quên mật khẩu?
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center my-6">
                        <div className="flex-1 h-px bg-gray-600"></div>
                        <span className="px-3 text-gray-400 text-sm">Hoặc đăng nhập với</span>
                        <div className="flex-1 h-px bg-gray-600"></div>
                    </div>

                    {/* Social Login */}
                    <div className="flex gap-4">
                        {/* <button className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        </button> */}
                        <div className="flex-1 py-3 bg-white hover:bg-gray-100 text-gray-900 rounded-lg flex items-center justify-center gap-2 transition-colors">
                            <LoginGoogle
                                onSuccess={setLoginGoogle}
                                setLoading={setLoading}
                                logoGoogle={logoGoogle}
                            > </LoginGoogle>
                        </div>
                    </div>
                </div>
            </div>
            <Loading isLoading={loading} />
        </div>
    );
};
