import React, { useState } from 'react';
import { useAuth } from '@/contexts/authcontext';
import { LoginModal } from '@components/auth/login';
import { RegisterModal } from '@components/auth/register';
import { AuthService } from '@/services/api-auth';
import { message } from 'antd';


// Custom SVG Icons
const HomeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9,22 9,12 15,12 15,22" />
    </svg>
);

const FlameIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
);

const BookIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
);

const MessageIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
    </svg>
);

const ImageIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
);

const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
    </svg>
);

const HeadphonesIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
    </svg>
);

const BookOpenIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
);

const PackageIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m7.5 4.27 9 5.15" />
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <path d="M12 22V12" />
    </svg>
);

const UsersIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="m22 21-2-2" />
        <circle cx="16" cy="11" r="2" />
    </svg>
);

const DollarIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" x2="12" y1="2" y2="22" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
);

const InfoIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
    </svg>
);

const StarIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
);

const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h18M3 6h18M3 18h18" /></svg>

);

const XIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
    </svg>
);

const ChevronUpIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m18 15-6-6-6 6" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m6 9 6 6 6-6" />
    </svg>
);

const Support = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 14 14"><path fill="currentColor" fillRule="evenodd" d="M6.987 1.5A3.18 3.18 0 0 0 3.75 4.628V9a1 1 0 0 1-1 1H1.5A1.5 1.5 0 0 1 0 8.5v-2A1.5 1.5 0 0 1 1.5 5h.75v-.39A4.68 4.68 0 0 1 7 0a4.68 4.68 0 0 1 4.75 4.61V5h.75A1.5 1.5 0 0 1 14 6.5v2a1.5 1.5 0 0 1-1.5 1.5h-.75v.5a2.75 2.75 0 0 1-2.44 2.733A1.5 1.5 0 0 1 8 14H6.5a1.5 1.5 0 0 1 0-3H8c.542 0 1.017.287 1.28.718a1.25 1.25 0 0 0 .97-1.218V4.627A3.18 3.18 0 0 0 6.987 1.5" clipRule="evenodd" /></svg>
);

const Logout = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="currentColor"><path d="M5 11H13V13H5V16L0 12L5 8V11ZM3.99927 18H6.70835C8.11862 19.2447 9.97111 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C9.97111 4 8.11862 4.75527 6.70835 6H3.99927C5.82368 3.57111 8.72836 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C8.72836 22 5.82368 20.4289 3.99927 18Z"></path></svg>
);

const Sidebar = () => {
    const URL_IMG = import.meta.env.VITE_URL_IMG;
    const { isAuthenticated, currentUser, setCurrentUser, setToken, setPermissions, setRoles } = useAuth();

    const [isOpen, setIsOpen] = useState(false);
    const [isDanhMucOpen, setIsDanhMucOpen] = useState(true);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const openLoginModal = () => {
        setIsLoginModalOpen(true);
        setIsRegisterModalOpen(false);
    };

    const openRegisterModal = () => {
        setIsRegisterModalOpen(true);
        setIsLoginModalOpen(false);
    };

    const toggleDanhMuc = () => {
        setIsDanhMucOpen(!isDanhMucOpen);
    };

    const closeAllModals = () => {
        setIsLoginModalOpen(false);
        setIsRegisterModalOpen(false);
        setShowPassword(false);
        setShowConfirmPassword(false);
    };

    const handleLogout = async () => {
        try {
            const response = await AuthService.logout();
            if (response) {
                message.success('Đã đăng xuất')
            } else {
                message.error('Đăng xuất thất bại!');
            };
        } catch (error) {
            console.error('Lỗi khi đăng xuất', error);
        } finally {
            setCurrentUser(null);
            setPermissions([]);
            setRoles([]);
            setToken(null);
        }
    }

    const menuItems = [
        { icon: HomeIcon, text: 'Trang chủ', hasNew: false },
        { icon: FlameIcon, text: 'Ưu đãi HOT', hasNew: false },
    ];

    const danhMucItems = [
        { icon: BookIcon, text: 'Sách điện tử', hasNew: false },
        { icon: MessageIcon, text: 'Sách nói', hasNew: false },
        { icon: ImageIcon, text: 'Truyện tranh', hasNew: false },
        { icon: SearchIcon, text: 'Sách hiểu Sói', hasNew: false },
        { icon: HeadphonesIcon, text: 'Podcast', hasNew: false },
        { icon: BookOpenIcon, text: 'Sách tóm tắt', hasNew: false },
    ];

    const otherItems = [
        { icon: PackageIcon, text: 'Combo', hasNew: false },
        { icon: UsersIcon, text: 'Tuyển tập', hasNew: false },
        { icon: DollarIcon, text: 'Tác giả', hasNew: false },
        { icon: InfoIcon, text: 'Tin tức', hasNew: false },
        { icon: StarIcon, text: 'Review sách', hasNew: false },
    ];

    const profileItems = [
        { icon: Support, text: 'Hỗ trơ', hasNew: false },
        ...(isAuthenticated ? [{ icon: Logout, text: 'Đăng xuất', hasNew: false }] : []),
    ];
    return (
        <>
            {/* Toggle Button - Always visible */}
            <button
                onClick={toggleSidebar}
                className="top-4 left-4 p-1 w-11 z-20 h-11 flex justify-center items-center text-white rounded-lg shadow-lg transition-all duration-200 hover:scale-105"
                aria-label={isOpen ? "Đóng menu" : "Mở menu"}
            >
                {isOpen ? <XIcon /> : <MenuIcon />}
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="inset-0 fixed bg-black bg-opacity-50 z-10"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed left-0 top-0 h-full w-80 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out z-10 overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>

                {/* Header Section */}
                <div className="p-6 border-b border-gray-700">
                    <div className="flex flex-col items-center">
                        {isAuthenticated && currentUser ? (
                            <>
                                <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center mb-4">
                                    <img
                                        className=" w-full h-full bg-white bg-opacity-30 rounded-full"
                                        src={
                                            currentUser?.image
                                                ? URL_IMG + currentUser.image
                                                : 'https://tse3.mm.bing.net/th?id=OIP.v6uzcpp3obKaXzgpB7hPpgHaHv&pid=Api&P=0&h=180'
                                        } />
                                </div>
                                <p className='w-full text-center font-semibold'>{currentUser?.fullName}</p>
                            </>
                        ) : (
                            <>
                                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center mb-4">
                                    <div className="w-8 h-8 bg-white bg-opacity-30 rounded-full"></div>
                                </div>
                                <button
                                    onClick={openLoginModal}
                                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-full transition-colors">
                                    ĐĂNG NHẬP
                                </button>
                            </>
                        )}

                        {/* User Name */}
                    </div>
                </div>

                {/* Main Menu Items */}
                <div className="px-4 py-2">
                    {menuItems.map((item, index) => (
                        <div key={index} className="flex items-center p-3 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors group">
                            <div className="mr-3 text-gray-400 group-hover:text-white">
                                <item.icon />
                            </div>
                            <span className="font-medium">{item.text}</span>
                        </div>
                    ))}
                </div>

                {/* Danh mục Section */}
                <div className="px-4 py-2 border-t border-gray-700">
                    <div
                        className="flex items-center justify-between p-3 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors"
                        onClick={toggleDanhMuc}
                    >
                        <span className="font-semibold text-lg">Danh mục</span>
                        {isDanhMucOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </div>

                    {/* Animated dropdown */}
                    <div className={`overflow-hidden transition-all duration-300 ${isDanhMucOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}>
                        {danhMucItems.map((item, index) => (
                            <div key={index} className="flex items-center p-3 ml-2 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors group">
                                <div className="mr-3 text-gray-400 group-hover:text-white">
                                    <item.icon />
                                </div>
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Other Menu Items */}
                <div className="px-4 py-2 border-t border-gray-700">
                    {otherItems.map((item, index) => (
                        <div key={index} className="flex items-center p-3 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors group">
                            <div className="mr-3 text-gray-400 group-hover:text-white">
                                <item.icon />
                            </div>
                            <span>{item.text}</span>
                        </div>
                    ))}
                </div>
                <div className="px-4 py-2 border-t border-gray-700">
                    {profileItems.map((item, index) => (
                        <div key={index}
                            onClick={item.text === 'Đăng xuất' ? handleLogout : null}
                            className="flex items-center p-3 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors group">
                            <div className="mr-3 text-gray-400 group-hover:text-white">
                                <item.icon />
                            </div>
                            <span>{item.text}</span>
                        </div>
                    ))}
                </div>
            </div>
            <LoginModal
                onLoginSuccess={() => {
                    setIsOpen(false);
                }}
                isOpen={isLoginModalOpen}
                onRegisterClick={openRegisterModal}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                openRegisterModal={openRegisterModal}
                closeAllModals={closeAllModals}
            />
            <RegisterModal
                onLoginSuccess={() => {
                    setIsOpen(false);
                }}
                isOpen={isRegisterModalOpen}
                closeAllModals={closeAllModals}
                onLoginClick={openLoginModal}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                showConfirmPassword={showConfirmPassword}
                setShowConfirmPassword={setShowConfirmPassword}
            />
        </>
    );
};

export default Sidebar;