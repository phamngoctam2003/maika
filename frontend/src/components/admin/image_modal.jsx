
const ImageModal = ({ imageSrc, closeModal }) => {
    if (!imageSrc) return null;
    const urlSRC = import.meta.env.VITE_URL_IMG + imageSrc;
    return (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-500 bg-opacity-75">
            <div className="bg-white p-2">
                <span className="text-4xl float-right cursor-pointer p-4" onClick={closeModal}>×</span>
                <img
                    src={urlSRC}
                    alt="Modal View"
                    className="w-96 h-auto"
                />
            </div>
        </div>
    );
};

export default ImageModal;