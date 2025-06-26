export const UserFooter = () => {
    return (
        <>
            <div className=" flex items-end">
                <footer className="w-full text-white">
                    <div className=" mx-10 px-4 py-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
                            <div className="lg:col-span-1">
                                <div className="mb-6">
                                    <h2 className="logomaika">MAIKA</h2 >
                                    <p className="text-gray-300 text-sm mb-4">Công ty cổ phần sách điện tử Maika</p>
                                    <div className="space-y-2 text-sm text-gray-300">
                                        <div className="flex items-center space-x-2">
                                            <span>📞</span>
                                            <span>0877736289</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span>✉️</span>
                                            <span>Support@waka.vn</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="inline-block bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold">
                                    ✓ ĐÃ THÔNG BÁO <br />
                                    BỘ CÔNG THƯƠNG
                                </div>
                            </div>

                            <div className="lg:col-span-1">
                                <h3 className="font-semibold text-white my-4">Về chúng tôi</h3>
                                <ul className="space-y-2 text-sm text-gray-300">
                                    <li><a href="#" className="hover:text-green-400 transition-colors">Giới thiệu</a></li>
                                    <li><a href="#" className="hover:text-green-400 transition-colors">Cơ cấu tổ chức</a></li>
                                    <li><a href="#" className="hover:text-green-400 transition-colors">Lĩnh vực hoạt động</a></li>
                                </ul>
                            </div>

                            <div className="lg:col-span-1">
                                <h3 className="font-semibold text-white my-4">Cơ hội đầu tư</h3>
                                <ul className="space-y-2 text-sm text-gray-300">
                                    <li><a href="#" className="hover:text-green-400 transition-colors">Tuyển dụng</a></li>
                                    <li><a href="#" className="hover:text-green-400 transition-colors">Liên hệ</a></li>
                                    <li><a href="#" className="hover:text-green-400 transition-colors">Dịch vụ xuất bản sách</a></li>
                                </ul>
                            </div>

                            <div className="lg:col-span-1">
                                <h3 className="font-semibold text-white my-4">Thông tin hữu ích</h3>
                                <ul className="space-y-2 text-sm text-gray-300">
                                    <li><a href="#" className="hover:text-green-400 transition-colors">Thỏa thuận sử dụng dịch vụ</a></li>
                                    <li><a href="#" className="hover:text-green-400 transition-colors">Quyền lợi</a></li>
                                    <li><a href="#" className="hover:text-green-400 transition-colors">Quy định riêng tư</a></li>
                                    <li><a href="#" className="hover:text-green-400 transition-colors">Câu hỏi thường gặp</a></li>
                                </ul>
                            </div>

                            <div className="lg:col-span-1">
                                <h3 className="font-semibold text-white my-4">Tin tức</h3>
                                <ul className="space-y-2 text-sm text-gray-300 mb-6">
                                    <li><a href="#" className="hover:text-green-400 transition-colors">Tin dịch vụ</a></li>
                                    <li><a href="#" className="hover:text-green-400 transition-colors">Review sách</a></li>
                                    <li><a href="#" className="hover:text-green-400 transition-colors">Lịch phát hành</a></li>
                                </ul>

                                <div className="space-y-4">
                                    <div className="bg-white p-2 inline-block rounded">
                                        <div className="w-16 h-16 bg-black flex items-center justify-center">
                                            <span className="text-white text-xs">QR</span>
                                        </div>
                                    </div>
                                    {/* <div className="space-y-2">
                                        <a href="#" className="block">
                                            <div className="h-10 bg-black rounded flex items-center justify-center text-white text-xs">
                                                Download on App Store
                                            </div>
                                        </a>
                                        <a href="#" className="block">
                                            <div className="h-10 bg-green-600 rounded flex items-center justify-center text-white text-xs">
                                                Get it on Google Play
                                            </div>
                                        </a>
                                    </div> */}
                                </div>
                            </div>
                        </div>

                        {/* Support Buttons
                        <div className="fixed bottom-6 right-6 z-50">
                            <div className="bg-blue-600 text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition-colors">
                                <span className="text-sm font-semibold">Zalo</span>
                            </div>
                        </div>

                        <div className="fixed bottom-6 right-20 z-50">
                            <div className="bg-green-600 text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-green-700 transition-colors">
                                <span className="text-xs">Hỗ trợ</span>
                            </div>
                        </div> */}

                        {/* Legal Information */}
                        <div className="border-t border-gray-700 pt-6">
                            <div className="text-xs text-gray-400 space-y-2">
                                <p>Công ty Cổ phần Sách điện tử Waka - Tầng 6, tháp văn phòng quốc tế Hoa Binh, số 106, đường Hoàng Quốc Việt, phường Nghĩa Đô, Quận Cầu Giấy, thành phố Hà Nội, Việt Nam.</p>
                                <p>ĐKKD số 0108796796 do SKHDT TP Hà Nội cấp ngày 24/06/2019</p>
                                <p>Giấy xác nhận Đăng ký hoạt động phát hành xuất bản phẩm điện tử số 8132/XN-CXBIPH do Cục Xuất bản, In và Phát hành cấp ngày 31/12/2019</p>
                                <p>Giấy chứng nhận Đăng ký cung cấp dịch vụ nội dung thông tin trên mạng Viễn thông di động số 19/GCN-ĐĐ do Cục Phát thanh, truyền hình và thông tin điện tử ký ngày 11/03/2020</p>
                                <p>Số VPCP: 024.73086566 | Số CSKH: 1900545482 nhận 5 | Hotline: 0877736289</p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
};