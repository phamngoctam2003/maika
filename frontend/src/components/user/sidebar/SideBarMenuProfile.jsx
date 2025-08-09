import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/authcontext';
import { AuthService } from '@/services/api-auth';
import { message } from 'antd';

export default function SidebarProfile({ formData, activePackage }) {
    const navigate = useNavigate();
    const URL_IMG = import.meta.env.VITE_URL_IMG;
    const { setCurrentUser, setIsAuthenticated, setPermissions, setRoles, setToken, setIsSupportOpenModal } = useAuth();

    const handleLogout = async () => {
            try {
                const response = await AuthService.logout();
                if (response) {
                    message.success('Đã đăng xuất');
                } else {
                    message.error('Đăng xuất thất bại!');
                };
            } catch (error) {
                console.error('Lỗi khi đăng xuất', error);
            } finally {
                setCurrentUser(null);
                setIsAuthenticated(false);
                setPermissions([]);
                setRoles([]);
                setToken(null);
            }
        }

    const menuItems = [
        {
            id: 'account',
            icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="25" height="25" fill="currentColor"><path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13Z"></path></svg>,
            label: 'Quản lý tài khoản', link: '/profile'
        },
        {
            id: 'personal',
            icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="25" height="25" fill="currentColor"><path d="M4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H14C14.5523 21 15 20.5523 15 20V15.2973L15.9995 19.9996C16.1143 20.5398 16.6454 20.8847 17.1856 20.7699L21.0982 19.9382C21.6384 19.8234 21.9832 19.2924 21.8684 18.7522L18.9576 5.0581C18.8428 4.51788 18.3118 4.17304 17.7716 4.28786L14.9927 4.87853C14.9328 4.38353 14.5112 4 14 4H10C10 3.44772 9.55228 3 9 3H4ZM10 6H13V14H10V6ZM10 19V16H13V19H10ZM8 5V15H5V5H8ZM8 17V19H5V17H8ZM17.3321 16.6496L19.2884 16.2338L19.7042 18.1898L17.7479 18.6057L17.3321 16.6496ZM16.9163 14.6933L15.253 6.86789L17.2092 6.45207L18.8726 14.2775L16.9163 14.6933Z"></path></svg>,
            label: 'Tủ sách cá nhân', link: '/profile/book-case'
        },
        {
            id: 'transactions',
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" color="currentColor"><path d="M13.5 15H6c-1.886 0-2.828 0-3.414-.586S2 12.886 2 11V7c0-1.886 0-2.828.586-3.414S4.114 3 6 3h12c1.886 0 2.828 0 3.414.586S22 5.114 22 7v5c0 .932 0 1.398-.152 1.765a2 2 0 0 1-1.083 1.083C20.398 15 19.932 15 19 15" /><path d="M14 9a2 2 0 1 1-4 0a2 2 0 0 1 4 0m-1 8a3 3 0 0 1 3-3v-2a3 3 0 0 1 3-3v5.5c0 2.335 0 3.502-.472 4.386a4 4 0 0 1-1.642 1.642C16.002 21 14.835 21 12.5 21H12c-1.864 0-2.796 0-3.53-.305a4 4 0 0 1-2.166-2.164C6 17.796 6 16.864 6 15" /></g></svg>,
            label: 'Lịch sử giao dịch', link: '/profile/transaction-histories'
        },
        {
            id: 'support',
            icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="25" height="25" fill="currentColor"><path d="M21 8C22.1046 8 23 8.89543 23 10V14C23 15.1046 22.1046 16 21 16H19.9381C19.446 19.9463 16.0796 23 12 23V21C15.3137 21 18 18.3137 18 15V9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9V16H3C1.89543 16 1 15.1046 1 14V10C1 8.89543 1.89543 8 3 8H4.06189C4.55399 4.05369 7.92038 1 12 1C16.0796 1 19.446 4.05369 19.9381 8H21ZM7.75944 15.7849L8.81958 14.0887C9.74161 14.6662 10.8318 15 12 15C13.1682 15 14.2584 14.6662 15.1804 14.0887L16.2406 15.7849C15.0112 16.5549 13.5576 17 12 17C10.4424 17 8.98882 16.5549 7.75944 15.7849Z"></path></svg>,
            label: 'Hỗ trợ khách hàng', onClick: () => setIsSupportOpenModal(true)
        },
        {
            id: 'logout',
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 16 16"><path fill="currentColor" d="M12 1c1.1 0 2 .895 2 2v9c0 1.1-.895 2-2 2H9.5a.5.5 0 0 1 0-1H12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H9.5a.5.5 0 0 1 0-1z"/><path fill="currentColor" d="M4.15 4.15a.5.5 0 0 1 .707.707l-2.15 2.15h6.79a.5.5 0 0 1 0 1h-6.79l2.15 2.15a.5.5 0 0 1-.707.707l-3-3a.5.5 0 0 1 0-.707l3-3z"/></svg>,
            label: 'Đăng xuất', onClick: () => handleLogout()
        }
    ];

    return (
        <div
            className="w-full border-r-[1px] border-gray-600 lg:w-72 pr-8 lg:block hidden">
            <div className="flex items-center gap-3 mb-6">
                {
                    formData?.image ? (
                        <img
                            src={`${URL_IMG}${formData.image}`}
                            alt="Avatar"
                            className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-cyan-400"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-cyan-400"></div>
                    )
                }
                <span className="font-medium">{formData?.fullName || ''}</span>
            </div>

            {activePackage ? (
                <div className="mb-6">
                    <span className="text-sm text-gray-400">Gói hiện tại: </span>
                    <span className="inline-block font-semibold text-sm text-white bg-yellow-500 px-3 py-1 rounded-full shadow-md hover:bg-yellow-600 transition-all duration-300">
                        {activePackage?.package_name || 'Gói chưa xác định'}
                    </span>

                </div>
            ) : (
                <div className="flex flex-col gap-2 mb-6">
                    <Link to="/package-plan" className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm font-medium transition-colors w-full">
                        Trở thành hội viên
                    </Link>
                </div>
            )}

            <nav className="space-y-1">
                {menuItems.map((item) => (
                    item.onClick ? (
                        <button
                            type="button"
                            key={item.id}
                            onClick={item.onClick}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-left transition-colors text-sm ${item.active
                                ? 'bg-gray-700 text-green-400'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                        >
                            <span className="text-base">{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    ) : (
                        <Link
                            to={item.link}
                            key={item.id}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-left transition-colors text-sm ${item.active
                                ? 'bg-gray-700 text-green-400'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                        >
                            <span className="text-base">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    )
                ))}
            </nav>
        </div>
    );
}
