
const SuccessModal = ({ isOpen, onClose, message = 'Thanh toán thành công!' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 sm:px-0">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md p-6 text-center animate-fadeIn">
        <div className="text-green-500 text-5xl mb-4">✔</div>
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">Thành công</h2>
        <p className="text-gray-600 text-sm sm:text-base mb-6">{message}</p>
        <button
          onClick={onClose}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg w-full sm:w-auto transition duration-300"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
