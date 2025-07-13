import React from 'react';

const LazyLoadDemo = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto">
        {/* Header */}
        <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600">
          <h1 className="text-4xl font-bold">Lazy Loading Demo</h1>
        </div>
        
        {/* Spacer để tạo khoảng cách */}
        <div className="h-96 flex items-center justify-center">
          <p className="text-xl">Scroll xuống để xem lazy loading hoạt động</p>
        </div>
        
        {/* Component 1: Latest Books */}
        <div className="border-t-2 border-gray-700 pt-8">
          <h2 className="text-2xl mb-4 text-center">Component 1: Latest Books</h2>
          <p className="text-center mb-8">Component này sẽ tải dữ liệu khi bạn scroll tới đây</p>
        </div>
        
        {/* Spacer */}
        <div className="h-96"></div>
        
        {/* Component 2: Book Ranking */}
        <div className="border-t-2 border-gray-700 pt-8">
          <h2 className="text-2xl mb-4 text-center">Component 2: Book Ranking</h2>
          <p className="text-center mb-8">Component này sẽ tải dữ liệu khi bạn scroll tới đây</p>
        </div>
        
        {/* Spacer */}
        <div className="h-96"></div>
        
        {/* Component 3: Proposed Books */}
        <div className="border-t-2 border-gray-700 pt-8">
          <h2 className="text-2xl mb-4 text-center">Component 3: Proposed Books</h2>
          <p className="text-center mb-8">Component này sẽ tải dữ liệu khi bạn scroll tới đây</p>
        </div>
        
        {/* Footer */}
        <div className="h-96 flex items-center justify-center">
          <p className="text-xl">End of demo</p>
        </div>
      </div>
    </div>
  );
};

export default LazyLoadDemo;
