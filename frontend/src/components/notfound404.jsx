export const Notfound404 = () => {
    return (
        <main 
            id="content" 
            role="main" 
            className="flex flex-col items-center justify-center text-center min-h-screen"
        >
            <div className="container mx-auto px-4">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                    {/* Ảnh minh họa */}
                    <div className="flex justify-center">
                        <img 
                            className="w-60 sm:w-80" 
                            src="/images/svg/think.svg" 
                            alt="Image Description"
                        />
                    </div>

                    {/* Nội dung lỗi 404 */}
                    <div className="flex flex-col items-center sm:items-start">
                        <h1 className="text-6xl font-bold">404</h1>
                        <p className="text-lg mt-4">
                            Rất tiếc, trang này không tồn tại.
                        </p>
                        <a className="mt-6 bg-black text-white font-bold py-3 px-6 rounded shadow hover:bg-gray-700 transition duration-300" href="/">
                            Quay về trang chủ
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
};
