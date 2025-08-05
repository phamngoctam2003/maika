import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/authcontext';
import Favourite from '@components/user/ProfileTabs/book_case/Favourite';
import SidebarProfile from '@components/user/sidebar/SidebarMenuProfile';
import BookCaseTabs from '@components/user/ProfileTabs/book_case/BookCaseTabs';
import RecentlyRead from '@components/user/ProfileTabs/book_case/RecentlyRead';
import RecentlyListened from '@components/user/ProfileTabs/book_case/RecentlyListened';
const BookCase = () => {
  const { currentUser, activePackage, loading, setLoading, isAuthenticated } = useAuth();
    const [selectedTab, setSelectedTab] = useState('recently-read');
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      message.error('Bạn cần đăng nhập để truy cập trang này.');
      navigate('/');
    }
  }, [isAuthenticated, loading, navigate]);


  const renderTabContent = () => {
    switch (selectedTab) {
      case 'favourite':
        return <Favourite />;
      case 'recently-read':
        return <RecentlyRead />;
      case 'recently-listened':
        return <RecentlyListened />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-color-root pt-28 w-full px-4 lg:px-12">
        <div className="flex flex-col lg:flex-row min-h-screen">
          <SidebarProfile formData={currentUser} activePackage={activePackage} />
          <div className="flex-1 p-6 lg:p-8">
            <h1 className="text-xl font-semibold mb-6">Tủ sách của tôi</h1>
            <BookCaseTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
            {renderTabContent()}
          </div>
        </div>
      </div>
    </>
  );
};

export default BookCase;
