import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Loading } from '@components/loading/loading';
import { AntNotification } from "@components/ui/notification";
import { message } from 'antd';
import { AuthService } from '@/services/api-auth';
import { useAuth } from '@/contexts/authcontext';

export const RegisterModal = ({
    onLoginSuccess,
    isOpen,
    closeAllModals,
    onLoginClick,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
}) => {
    const [loading, setLoading] = useState(false);
    const { setCurrentUser, setToken, setPermissions, setIsAuthenticated } = useAuth();

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData(e.target);
            const res = await AuthService.register(formData);
            setLoading(true);
            if (res && res.access_token) {
                setLoginGoogle(res);
                return true;
            } else {
                AntNotification.showNotification("Đăng ký thất bại", res.message, "error");
                return false;
            }
        } catch (error) {
            console.error('Lỗi khi xử lý đăng nhập/đăng ký:', error);
            AntNotification.handleError(error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const setLoginGoogle = (response) => {
        console.log("Login Google response:", response);
        if (!response || !response.user) {
            message.error("Đăng nhập thất bại, vui lòng thử lại sau");
            return;
        }
        if (!response.access_token) {
            message.error("Không nhận được token, vui lòng thử lại sau");
            return;
        }
        message.success("Đăng ký tài khoản thành công");
        const user = response.user;
        const permissions = response.permissions || [];
        setCurrentUser(user);
        setPermissions(permissions);
        setToken(response.access_token);
        setIsAuthenticated(true);
        closeAllModals();
        if (onLoginSuccess) onLoginSuccess();
        if (permissions && permissions.length > 0) {
            return <Navigate to="/admin" />;
        } else {
            return <Navigate to="/" />;
        }
    }
    if (!isOpen) return null;
    return (
        <div className={`fixed left-0 top-0 h-full w-full bg-gray-900 text-white transform transition-transform duration-300 ease-in-out z-10 overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
            <div className="bg-gray-900 w-full relative overflow-hidden">
                <div className="relative z-10 p-6">
                    <button
                        onClick={closeAllModals}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                    >
                        <span className="w-24 h-24">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 1024 1024"><path fill="currentColor" d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504L738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512L828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496L285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512L195.2 285.696a64 64 0 0 1 0-90.496z" /></svg>
                        </span>
                    </button>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-900">HT</span>
                        </div>
                        <span className="text-white text-sm">Hỗ trợ</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white text-center mb-2">MAIKA</h1>
                    <p className="text-gray-300 text-center text-sm mb-8">
                        Đăng ký tài khoản để trải nghiệm đầy đủ tính năng của MAIKA
                    </p>
                    <form className="space-y-4" onSubmit={onSubmit}>
                        <div>
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Họ và tên"
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                name="email"
                                placeholder="Email"
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
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="password_confirmation"
                                placeholder="Xác nhận mật khẩu"
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                                {showConfirmPassword ?
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
                            ĐĂNG KÝ
                        </button>
                    </form>
                    <div className="flex justify-center mt-6 text-sm">
                        <span className="text-gray-400 mr-2">Đã có tài khoản?</span>
                        <button
                            onClick={onLoginClick}
                            className="text-green-400 hover:text-green-300 transition-colors"
                        >
                            Đăng nhập ngay
                        </button>
                    </div>
                </div>
            </div >
            <Loading isLoading={loading} />
        </div >
    );
};
