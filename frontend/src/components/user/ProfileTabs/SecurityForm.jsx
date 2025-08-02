import React, { useState } from 'react';
import { message } from 'antd';
import ProfileService from '@/services/users/api-profile';

export default function SecurityForm({ currentUser }) {
  console.log('SecurityForm currentUser:', currentUser?.google_id);
  if (currentUser?.google_id) {
    // Nếu người dùng đã liên kết tài khoản Google
    return (
      <div className="max-w-2xl">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold mb-4">Đã liên kết ✔️</h2>
          <p className="text-gray-400 mb-2">Tài khoản của bạn đã được liên kết với Google.</p>
          {/* <button className="bg-red-500 hover:bg-red-600 px-6 py-2.5 rounded text-white font-medium transition-colors">
            Ngắt liên kết tài khoản Google
          </button> */}
        </div>
      </div>
    );
  } else {
    // State cho các trường mật khẩu
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async (e) => {
      e.preventDefault();
      if (!currentPassword || !newPassword || !confirmPassword) {
        message.warning('Vui lòng nhập đầy đủ thông tin.');
        return;
      }
      if (newPassword !== confirmPassword) {
        message.error('Mật khẩu xác nhận không khớp.');
        return;
      }
      setLoading(true);
      try {
        // Gọi API đổi mật khẩu (bạn cần tạo API này ở backend)
        await ProfileService.changePassword({
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: confirmPassword,
        });
        message.success('Đổi mật khẩu thành công!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Đổi mật khẩu thất bại.';
        message.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    const handleCancel = () => {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    };

    return (
      <div className="max-w-2xl">
        <form className="space-y-4" onSubmit={handleChangePassword}>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Mật khẩu hiện tại</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu hiện tại"
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded text-white focus:ring-1 focus:ring-green-400 focus:border-green-400 outline-none transition-all"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Mật khẩu mới</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu mới"
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded text-white focus:ring-1 focus:ring-green-400 focus:border-green-400 outline-none transition-all"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Xác nhận mật khẩu</label>
            <input
              type="password"
              placeholder="Xác nhận mật khẩu mới"
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded text-white focus:ring-1 focus:ring-green-400 focus:border-green-400 outline-none transition-all"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 px-6 py-2.5 rounded text-white font-medium transition-colors"
              disabled={loading}
            >
              {loading ? 'Đang cập nhật...' : 'Cập nhật'}
            </button>
            <button
              type="button"
              className="bg-gray-700 hover:bg-gray-600 px-6 py-2.5 rounded text-white font-medium transition-colors"
              onClick={handleCancel}
              disabled={loading}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    );
  }
}