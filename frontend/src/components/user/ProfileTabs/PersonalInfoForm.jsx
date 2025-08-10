import { DatePicker } from 'antd';
import dayjs from 'dayjs';

export default function PersonalInfoForm({
    formData,
    handleInputChange,
    onUpdate,
    onCancel,
    onFileChange,
    avatarPreview
}) {
    const URL_IMG = import.meta.env.VITE_URL_IMG;
    // Ưu tiên hiển thị ảnh xem trước, nếu không có thì hiển thị ảnh hiện tại từ server
    const avatarSrc = avatarPreview ? avatarPreview : (formData?.image ? `${URL_IMG}${formData.image}` : null);
    return (
        <div className="flex flex-col xl:flex-row gap-8">
            <div className="flex-1 max-w-2xl">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">
                            Họ và tên
                        </label>
                        <input
                            type="text"
                            value={formData?.fullName || ''}
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded text-white focus:ring-1 focus:ring-green-400 focus:border-green-400 outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">
                            ID người dùng
                        </label>
                        <input
                            type="text"
                            value={formData?.id || ''}
                            onChange={(e) => handleInputChange('id', e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded text-white focus:ring-1 focus:ring-green-400 focus:border-green-400 outline-none transition-all"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor='birthDay' className="block text-sm text-gray-400 mb-1">
                                Ngày sinh
                            </label>
                            <div className="relative">
                                <DatePicker
                                    name="birthDay"
                                    format="YYYY-MM-DD"
                                    placeholder="Chọn ngày sinh"
                                    inputReadOnly={false}
                                    value={formData?.birthDay ? dayjs(formData.birthDay) : null}
                                    onChange={(_, dateString) => handleInputChange('birthDay', dateString)}
                                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded text-white focus:ring-1 focus:ring-green-400 focus:border-green-400 outline-none transition-all"
                                />
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">📅</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">
                                Giới tính
                            </label>
                            <div className="relative">
                                <select
                                    value={formData?.gender || ''}
                                    onChange={(e) => handleInputChange('gender', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded text-white focus:ring-1 focus:ring-green-400 focus:border-green-400 outline-none transition-all appearance-none pr-10"
                                >
                                    <option value="Khác">Khác</option>
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                </select>
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">⬇️</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-6">
                        <button onClick={onUpdate} className="bg-green-500 hover:bg-green-600 px-6 py-2.5 rounded text-white font-medium transition-colors">
                            Cập nhật
                        </button>
                        <button onClick={onCancel} className="bg-gray-700 hover:bg-gray-600 px-6 py-2.5 rounded text-white font-medium transition-colors">
                            Hủy
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center xl:items-start mt-6 mx-8">
                {
                    avatarSrc ? (
                        <img
                            src={avatarSrc}
                            alt="Avatar"
                            className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-cyan-400 mb-3 flex-shrink-0 object-cover"
                        />
                    ) : (
                        <img src="/images/png/image_user.png" className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-cyan-400 mb-3 flex-shrink-0" />
                    )
                }
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={onFileChange}
                    accept="image/png, image/jpeg, image/gif"
                />
                <label htmlFor="file-upload" className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm text-white font-medium transition-colors cursor-pointer">Chọn ảnh</label>
            </div>
        </div>
    );
}