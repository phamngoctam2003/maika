import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/authcontext';
import SidebarProfile from '@components/user/sidebar/SidebarMenuProfile';
import ProfileTabs from '@components/user/ProfileTabs/ProfileTabs';
import PersonalInfoForm from '@components/user/ProfileTabs/PersonalInfoForm';
// import AddressForm from '@components/user/ProfileTabs/AddressForm';
import SecurityForm from '@components/user/ProfileTabs/SecurityForm';
import LinkedAccountForm from '@components/user/ProfileTabs/LinkedAccountForm';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import ProfileService from '@/services/users/api-profile';

export default function ProfileManagement() {
  const [selectedTab, setSelectedTab] = useState('personal');
  // Lấy thêm hàm refreshUser từ context để cập nhật lại thông tin sau khi sửa
  const { currentUser, activePackage, loading, getCurrentUser, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({});
  const [avatarFile, setAvatarFile] = useState(null); // State cho file ảnh
  const [avatarPreview, setAvatarPreview] = useState(null); // State cho ảnh xem trước

  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      message.error('Bạn cần đăng nhập để truy cập trang này.');
      navigate('/');
    } else {
      setFormData(currentUser);
    }
  }, [isAuthenticated, loading, navigate]);

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  /**
   * Xử lý khi người dùng chọn một file ảnh mới.
   */
  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file); // Lưu file vào state
      setAvatarPreview(URL.createObjectURL(file)); // Tạo URL tạm thời để xem trước
    }
  }, []);

  /**
   * Gửi dữ liệu đã thay đổi lên server để cập nhật.
   */
  const handleUpdateProfile = async () => {
    message.loading({ content: 'Đang cập nhật...', key: 'updateProfile' });

    // Sử dụng FormData để có thể gửi cả file và text
    const data = new FormData();

    // Chỉ thêm các trường đã bị thay đổi vào FormData để tối ưu
    Object.keys(formData).forEach(key => {
      if (formData[key] !== currentUser[key]) {
        data.append(key, formData[key] ?? ''); // Gửi chuỗi rỗng nếu giá trị là null/undefined
      }
    });

    // Nếu có file ảnh mới, thêm vào FormData
    if (avatarFile) {
      data.append('image', avatarFile);
    }

    // Kiểm tra xem có gì thay đổi không trước khi gọi API
    if (!data.entries().next().value && !avatarFile) {
      message.info({ content: 'Không có thông tin nào thay đổi.', key: 'updateProfile' });
      return;
    }

    try {
      const response = await ProfileService.updateUserProfile(data);
      // Kiểm tra response.message hoặc response.status
      if (response) {
        message.success({ content: response.message, key: 'updateProfile' });
        await getCurrentUser();
        setAvatarFile(null);
        setAvatarPreview(null);
      } else {
        message.error({ content: response.message || 'Cập nhật thất bại.', key: 'updateProfile' });
      }

    } catch (error) {
      const errorMessage = error.response?.message || 'Cập nhật thất bại. Vui lòng thử lại.';
      message.error({ content: errorMessage, key: 'updateProfile' });
    }
  };

  /**
   * Hủy các thay đổi và reset form về trạng thái ban đầu.
   */
  const handleCancelEdit = useCallback(() => {
    setFormData(currentUser || {});
    setAvatarFile(null);
    setAvatarPreview(null);
    message.info('Đã hủy các thay đổi.');
  }, [currentUser]);

  // Xử lý đổi mật khẩu
  const handleChangePassword = async (currentPassword, newPassword, confirmPassword, resetFields) => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      message.warning('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    if (newPassword !== confirmPassword) {
      message.error('Mật khẩu xác nhận không khớp.');
      return;
    }
    message.loading({ content: 'Đang đổi mật khẩu...', key: 'changePassword' });
    try {
      await ProfileService.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });
      message.success({ content: 'Đổi mật khẩu thành công!', key: 'changePassword' });
      if (typeof resetFields === 'function') resetFields();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Đổi mật khẩu thất bại.';
      message.error({ content: errorMsg, key: 'changePassword' });
    }
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'personal':
        return <PersonalInfoForm formData={formData} handleInputChange={handleInputChange} onUpdate={handleUpdateProfile} onCancel={handleCancelEdit} onFileChange={handleFileChange} avatarPreview={avatarPreview} />;
      // case 'address':
      //   return <AddressForm />;
      case 'security':
        return (
          <SecurityForm
            currentUser={currentUser}
            onChangePassword={handleChangePassword}
          />
        );
      case 'linked':
        return <LinkedAccountForm currentUser={currentUser} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-color-root pt-28 w-full px-4 lg:px-12">
      <div className="flex flex-col lg:flex-row min-h-screen">
        <SidebarProfile formData={currentUser} activePackage={activePackage} />

        <div className="flex-1 lg:p-8">
          <h1 className="text-xl font-semibold mb-6">Quản lý thông tin</h1>

          <ProfileTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}