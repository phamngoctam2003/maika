import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/authcontext';

const ModalSupport = () => {
    const { isSupportOpenModal, setIsSupportOpenModal } = useAuth();
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isSupportOpenModal) {
            setShow(true);
        } else {
            // Delay 300ms để chạy hiệu ứng ẩn
            const timer = setTimeout(() => setShow(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isSupportOpenModal]);

    if (!isSupportOpenModal && !show) return null;

    return (
        <div
            className={`fixed inset-0 z-[1000] flex justify-center items-center bg-black bg-opacity-50 transition-opacity duration-300 ${isSupportOpenModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setIsSupportOpenModal(false)}
        >
            <div
                className={`relative w-[400px] bg-gray-800 rounded-lg p-6 text-white transform transition-all duration-300 ${isSupportOpenModal ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={() => setIsSupportOpenModal(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 1024 1024"><path fill="currentColor" d="M512 0C229.232 0 0 229.232 0 512c0 282.784 229.232 512 512 512c282.784 0 512-229.216 512-512C1024 229.232 794.784 0 512 0zm0 961.008c-247.024 0-448-201.984-448-449.01c0-247.024 200.976-448 448-448s448 200.977 448 448s-200.976 449.01-448 449.01zm181.008-630.016c-12.496-12.496-32.752-12.496-45.248 0L512 466.752l-135.76-135.76c-12.496-12.496-32.752-12.496-45.264 0c-12.496 12.496-12.496 32.752 0 45.248L466.736 512l-135.76 135.76c-12.496 12.48-12.496 32.769 0 45.249c12.496 12.496 32.752 12.496 45.264 0L512 557.249l135.76 135.76c12.496 12.496 32.752 12.496 45.248 0c12.496-12.48 12.496-32.769 0-45.249L557.248 512l135.76-135.76c12.512-12.512 12.512-32.768 0-45.248z" /></svg>
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold mb-2">Bạn cần hỗ trợ</h2>
                    <p className="text-sm text-gray-300">Liên hệ với chúng tôi thông qua các kênh hỗ trợ</p>
                </div>

                {/* Social Media Buttons */}
                <div className="flex gap-3 mb-6">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-full py-2 px-4 flex items-center justify-center gap-2 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 256 256"><defs><radialGradient id="logosMessenger0" cx="19.247%" cy="99.465%" r="108.96%" fx="19.247%" fy="99.465%"><stop offset="0%" stopColor="#09F" /><stop offset="60.975%" stopColor="#A033FF" /><stop offset="93.482%" stopColor="#FF5280" /><stop offset="100%" stopColor="#FF7061" /></radialGradient></defs><path fill="url(#logosMessenger0)" d="M128 0C55.894 0 0 52.818 0 124.16c0 37.317 15.293 69.562 40.2 91.835c2.09 1.871 3.352 4.493 3.438 7.298l.697 22.77c.223 7.262 7.724 11.988 14.37 9.054L84.111 243.9a10.218 10.218 0 0 1 6.837-.501c11.675 3.21 24.1 4.92 37.052 4.92c72.106 0 128-52.818 128-124.16S200.106 0 128 0Z" /><path fill="#FFF" d="m51.137 160.47l37.6-59.653c5.98-9.49 18.788-11.853 27.762-5.123l29.905 22.43a7.68 7.68 0 0 0 9.252-.027l40.388-30.652c5.39-4.091 12.428 2.36 8.82 8.085l-37.6 59.654c-5.981 9.489-18.79 11.852-27.763 5.122l-29.906-22.43a7.68 7.68 0 0 0-9.25.027l-40.39 30.652c-5.39 4.09-12.427-2.36-8.818-8.085Z" /></svg>
                        <span className="text-sm font-medium">Messenger</span>
                    </button>
                    <button className="flex-1 bg-blue-500 hover:bg-blue-600 rounded-full py-2 px-4 flex items-center justify-center gap-2 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 48 48">
                            <path fill="#2962ff" d="M15,36V6.827l-1.211-0.811C8.64,8.083,5,13.112,5,19v10c0,7.732,6.268,14,14,14h10	c4.722,0,8.883-2.348,11.417-5.931V36H15z"></path><path fill="#eee" d="M29,5H19c-1.845,0-3.601,0.366-5.214,1.014C10.453,9.25,8,14.528,8,19	c0,6.771,0.936,10.735,3.712,14.607c0.216,0.301,0.357,0.653,0.376,1.022c0.043,0.835-0.129,2.365-1.634,3.742	c-0.162,0.148-0.059,0.419,0.16,0.428c0.942,0.041,2.843-0.014,4.797-0.877c0.557-0.246,1.191-0.203,1.729,0.083	C20.453,39.764,24.333,40,28,40c4.676,0,9.339-1.04,12.417-2.916C42.038,34.799,43,32.014,43,29V19C43,11.268,36.732,5,29,5z"></path><path fill="#2962ff" d="M36.75,27C34.683,27,33,25.317,33,23.25s1.683-3.75,3.75-3.75s3.75,1.683,3.75,3.75	S38.817,27,36.75,27z M36.75,21c-1.24,0-2.25,1.01-2.25,2.25s1.01,2.25,2.25,2.25S39,24.49,39,23.25S37.99,21,36.75,21z"></path><path fill="#2962ff" d="M31.5,27h-1c-0.276,0-0.5-0.224-0.5-0.5V18h1.5V27z"></path><path fill="#2962ff" d="M27,19.75v0.519c-0.629-0.476-1.403-0.769-2.25-0.769c-2.067,0-3.75,1.683-3.75,3.75S22.683,27,24.75,27c0.847,0,1.621-0.293,2.25-0.769V26.5c0,0.276,0.224,0.5,0.5,0.5h1v-7.25H27z M24.75,25.5	c-1.24,0-2.25-1.01-2.25-2.25S23.51,21,24.75,21S27,22.01,27,23.25S25.99,25.5,24.75,25.5z"></path><path fill="#2962ff" d="M21.25,18h-8v1.5h5.321L13,26h0.026c-0.163,0.211-0.276,0.463-0.276,0.75V27h7.5	c0.276,0,0.5-0.224,0.5-0.5v-1h-5.321L21,19h-0.026c0.163-0.211,0.276-0.463,0.276-0.75V18z"></path>
                        </svg>
                        <span className="text-sm font-medium">Zalo</span>
                    </button>
                </div>

                {/* Or Divider */}
                <div className="text-center text-gray-400 text-sm mb-6">Hoặc</div>

                {/* Contact Options */}
                <div className="space-y-3">
                    <div className="bg-gray-700 hover:bg-gray-600 rounded-lg p-3 flex items-center gap-3 cursor-pointer transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 16 16"><path fill="currentColor" d="M12.2 10c-1.1-.1-1.7 1.4-2.5 1.8C8.4 12.5 6 10 6 10S3.5 7.6 4.1 6.3c.5-.8 2-1.4 1.9-2.5c-.1-1-2.3-4.6-3.4-3.6C.2 2.4 0 3.3 0 5.1c-.1 3.1 3.9 7 3.9 7c.4.4 3.9 4 7 3.9c1.8 0 2.7-.2 4.9-2.6c1-1.1-2.5-3.3-3.6-3.4z" /></svg>
                        <span className="text-sm">Hotline: 0822561955</span>
                    </div>

                    <div className="bg-gray-700 hover:bg-gray-600 rounded-lg p-3 flex items-center gap-3 cursor-pointer transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="25" height="25" fill="currentColor"><path d="M21 8C22.1046 8 23 8.89543 23 10V14C23 15.1046 22.1046 16 21 16H19.9381C19.446 19.9463 16.0796 23 12 23V21C15.3137 21 18 18.3137 18 15V9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9V16H3C1.89543 16 1 15.1046 1 14V10C1 8.89543 1.89543 8 3 8H4.06189C4.55399 4.05369 7.92038 1 12 1C16.0796 1 19.446 4.05369 19.9381 8H21ZM7.75944 15.7849L8.81958 14.0887C9.74161 14.6662 10.8318 15 12 15C13.1682 15 14.2584 14.6662 15.1804 14.0887L16.2406 15.7849C15.0112 16.5549 13.5576 17 12 17C10.4424 17 8.98882 16.5549 7.75944 15.7849Z"></path></svg>
                        <span className="text-sm">Tổng đài: 1900545482</span>
                    </div>

                    <div className="bg-gray-700 hover:bg-gray-600 rounded-lg p-3 flex items-center gap-3 cursor-pointer transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 20 20"><path fill="currentColor" fill-rule="evenodd" d="m7.172 11.334l2.83 1.935l2.728-1.882l6.115 6.033c-.161.052-.333.08-.512.08H1.667c-.22 0-.43-.043-.623-.12l6.128-6.046ZM20 6.376v9.457c0 .247-.054.481-.15.692l-5.994-5.914L20 6.376ZM0 6.429l6.042 4.132l-5.936 5.858A1.663 1.663 0 0 1 0 15.833V6.43ZM18.333 2.5c.92 0 1.667.746 1.667 1.667v.586L9.998 11.648L0 4.81v-.643C0 3.247.746 2.5 1.667 2.5h16.666Z" /></svg>
                        <span className="text-sm">Email: ngoctampksv@gmail.com</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalSupport;
