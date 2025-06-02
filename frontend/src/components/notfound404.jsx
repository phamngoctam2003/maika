export const Notfound404 = () => {
    return (
        <main id="content" role="main" className="main m-auto h-100">
        <div className="content container m-auto p-20">
            <div className="row align-items-sm-center py-sm-10 m-auto">
                <div className="col-sm-6">
                    <div className="text-center text-sm-right mr-sm-4 mb-5 mb-sm-0">
                        <img
                            className="w-60 w-sm-100 mx-auto"
                            src="/images/svg/think.svg"
                            alt="Image Description"
                            style={{ maxWidth: "15rem" }}
                        />
                    </div>
                </div>
                <div className="col-sm-6 col-md-4 text-center text-sm-left">
                    <h1 className="display-1 mb-0 text-6xl font-bold">404</h1>
                    <p className="lead mb-5">
                        Rất tiếc, trang này không tồn tại.
                    </p>
                    <a className="bg-black text-white font-bold py-3 px-6 rounded shadow hover:bg-gray-700 transition duration-300" href="/">
                        Quay về trang chủ
                    </a>
                </div>
            </div>
        </div>
        </main>
    );
};
