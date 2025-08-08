import { Link } from 'react-router-dom';
export default function SidebarProfile({ formData, activePackage }) {
    const URL_IMG = import.meta.env.VITE_URL_IMG;
    const menuItems = [
        { id: 'account', icon: '👤', label: 'Quản lý tài khoản', link: '/profile' },
        { id: 'personal', icon: '📄', label: 'Tủ sách cá nhân', link: '/profile/book-case' },
        { id: 'transactions', icon: '📊', label: 'Lịch sử giao dịch', link: '/profile/transaction-histories' },
        { id: 'support', icon: '🎧', label: 'Hỗ trợ khách hàng', link: '/profile/support' }
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
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-cyan-400"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-cyan-400"></div>
                    )
                }
                <span className="font-medium">{formData?.fullName || ''}</span>
            </div>

            <div className="flex gap-4 mb-6">
                <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                    <span className="text-sm">0</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                    <span className="text-sm">0</span>
                </div>
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
                ))}
            </nav>
        </div>
    );
}
