import React, { useState } from 'react';
export default function LoginSidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const X = 'x' ;
    const Menu = 'menu' ;
    const Eye = 'eye' ;
    const EyeOff = 'eye-off' ;
    const [formData, setFormData] = useState({
        phone: '',
        password: ''
    });
    const [registerData, setRegisterData] = useState({
        phone: '',
        password: '',
        confirmPassword: '',
        name: ''
    });

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const openLoginModal = () => {
        setIsLoginModalOpen(true);
        setIsRegisterModalOpen(false);
    };

    const openRegisterModal = () => {
        setIsRegisterModalOpen(true);
        setIsLoginModalOpen(false);
    };

    const closeLoginModal = () => {
        setIsLoginModalOpen(false);
        setFormData({ phone: '', password: '' });
        setShowPassword(false);
    };

    const closeRegisterModal = () => {
        setIsRegisterModalOpen(false);
        setRegisterData({ phone: '', password: '', confirmPassword: '', name: '' });
        setShowPassword(false);
        setShowConfirmPassword(false);
    };

    const closeAllModals = () => {
        setIsLoginModalOpen(false);
        setIsRegisterModalOpen(false);
        setFormData({ phone: '', password: '' });
        setRegisterData({ phone: '', password: '', confirmPassword: '', name: '' });
        setShowPassword(false);
        setShowConfirmPassword(false);
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegisterInputChange = (e) => {
        setRegisterData({
            ...registerData,
            [e.target.name]: e.target.value
        });
    };

    const handleLogin = (e) => {
        e.preventDefault();
        console.log('Login data:', formData);
    };

    const handleRegister = (e) => {
        e.preventDefault();
        console.log('Register data:', registerData);
    };

    const books = [
        { title: 'LỊCH SỬ VIỆT NAM', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=120&h=160&fit=crop' },
        { title: 'ĐẮC NHÂN TÂM', image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=120&h=160&fit=crop' },
        { title: 'KHỞI NGHIỆP', image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=120&h=160&fit=crop' },
        { title: '10 ĐIỀU TÀO TIỀN', image: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=120&h=160&fit=crop' }
    ];

    return (
        <div className="min-h-screen bg-gray-100 relative">
            {/* Header */}
            <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <Menu className="w-6 h-6 text-gray-700" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">WAKA</h1>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Hỗ trợ</span>
                </div>
            </header>

            {/* Main Content */}
            <main className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {books.map((book, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <img
                                src={book.image}
                                alt={book.title}
                                className="w-full h-32 sm:h-40 object-cover"
                            />
                            <div className="p-2">
                                <h3 className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-2">{book.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 z-50 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0 lg:static lg:w-64`}>
                <div className="p-4 border-b flex items-center justify-between lg:justify-center">
                    <h2 className="text-xl font-bold text-gray-800">Menu</h2>
                    <button
                        onClick={toggleSidebar}
                        className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
                    >
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                <nav className="p-4">
                    <ul className="space-y-2">
                        <li>
                            <a href="#" className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                Trang chủ
                            </a>
                        </li>
                        <li>
                            <a href="#" className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                Thể loại
                            </a>
                        </li>
                        <li>
                            <a href="#" className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                Yêu thích
                            </a>
                        </li>
                        <li>
                            <button
                                onClick={openLoginModal}
                                className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Đăng nhập
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={openRegisterModal}
                                className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Đăng ký
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Login Modal */}
            {isLoginModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-60 p-4">
                    <div className="bg-gray-900 rounded-2xl w-full max-w-md mx-auto relative overflow-hidden">
                        {/* Background Books */}
                        <div className="absolute inset-0 opacity-30">
                            <div className="grid grid-cols-4 gap-2 p-4">
                                {books.concat(books).map((book, index) => (
                                    <img
                                        key={index}
                                        src={book.image}
                                        alt={book.title}
                                        className="w-full h-20 object-cover rounded opacity-50"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="relative z-10 p-6">
                            {/* Close Button */}
                            <button
                                onClick={closeAllModals}
                                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* Support Badge */}
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                    <span className="text-xs font-bold text-gray-900">HT</span>
                                </div>
                                <span className="text-white text-sm">Hỗ trợ</span>
                            </div>

                            {/* WAKA Logo */}
                            <h1 className="text-4xl font-bold text-white text-center mb-2">WAKA</h1>
                            <p className="text-gray-300 text-center text-sm mb-8">
                                Đăng nhập để đồng bộ dữ liệu của tài khoản trên nhiều thiết bị
                            </p>

                            {/* Login Form */}
                            <div className="space-y-4">
                                <div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Số điện thoại"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                                    />
                                </div>

                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Mật khẩu"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>

                                <button
                                    onClick={handleLogin}
                                    className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
                                >
                                    ĐĂNG NHẬP
                                </button>
                            </div>

                            {/* Links */}
                            <div className="flex justify-between mt-6 text-sm">
                                <button
                                    onClick={openRegisterModal}
                                    className="text-green-400 hover:text-green-300 transition-colors"
                                >
                                    Đăng ký ngay
                                </button>
                                <a href="#" className="text-green-400 hover:text-green-300 transition-colors">
                                    Quên mật khẩu?
                                </a>
                            </div>

                            {/* Divider */}
                            <div className="flex items-center my-6">
                                <div className="flex-1 h-px bg-gray-600"></div>
                                <span className="px-3 text-gray-400 text-sm">Hoặc đăng nhập với</span>
                                <div className="flex-1 h-px bg-gray-600"></div>
                            </div>

                            {/* Social Login */}
                            <div className="flex gap-4">
                                <button className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </button>
                                <button className="flex-1 py-3 bg-white hover:bg-gray-100 text-gray-900 rounded-lg flex items-center justify-center gap-2 transition-colors">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Register Modal */}
            {isRegisterModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-60 p-4">
                    <div className="bg-gray-900 rounded-2xl w-full max-w-md mx-auto relative overflow-hidden">
                        {/* Background Books */}
                        <div className="absolute inset-0 opacity-30">
                            <div className="grid grid-cols-4 gap-2 p-4">
                                {books.concat(books).map((book, index) => (
                                    <img
                                        key={index}
                                        src={book.image}
                                        alt={book.title}
                                        className="w-full h-20 object-cover rounded opacity-50"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="relative z-10 p-6">
                            {/* Close Button */}
                            <button
                                onClick={closeAllModals}
                                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* Support Badge */}
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                    <span className="text-xs font-bold text-gray-900">HT</span>
                                </div>
                                <span className="text-white text-sm">Hỗ trợ</span>
                            </div>

                            {/* WAKA Logo */}
                            <h1 className="text-4xl font-bold text-white text-center mb-2">WAKA</h1>
                            <p className="text-gray-300 text-center text-sm mb-8">
                                Đăng ký tài khoản để trải nghiệm đầy đủ tính năng của WAKA
                            </p>

                            {/* Register Form */}
                            <div className="space-y-4">
                                <div>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Họ và tên"
                                        value={registerData.name}
                                        onChange={handleRegisterInputChange}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                                    />
                                </div>

                                <div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Số điện thoại"
                                        value={registerData.phone}
                                        onChange={handleRegisterInputChange}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                                    />
                                </div>

                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Mật khẩu"
                                        value={registerData.password}
                                        onChange={handleRegisterInputChange}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>

                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        placeholder="Xác nhận mật khẩu"
                                        value={registerData.confirmPassword}
                                        onChange={handleRegisterInputChange}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>

                                <button
                                    onClick={handleRegister}
                                    className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
                                >
                                    ĐĂNG KÝ
                                </button>
                            </div>

                            {/* Links */}
                            <div className="flex justify-center mt-6 text-sm">
                                <span className="text-gray-400 mr-2">Đã có tài khoản?</span>
                                <button
                                    onClick={openLoginModal}
                                    className="text-green-400 hover:text-green-300 transition-colors"
                                >
                                    Đăng nhập ngay
                                </button>
                            </div>

                            {/* Divider */}
                            <div className="flex items-center my-6">
                                <div className="flex-1 h-px bg-gray-600"></div>
                                <span className="px-3 text-gray-400 text-sm">Hoặc đăng ký với</span>
                                <div className="flex-1 h-px bg-gray-600"></div>
                            </div>

                            {/* Social Register */}
                            <div className="flex gap-4">
                                <button className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </button>
                                <button className="flex-1 py-3 bg-white hover:bg-gray-100 text-gray-900 rounded-lg flex items-center justify-center gap-2 transition-colors">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}