import React from 'react';
import { LatestBooks } from '@components/user/home/latest_books';
import { BookRank } from '@components/user/home/book_rank';
import { Propose } from '@components/user/home/propose';

const OptimizedHomePage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero section */}
      <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Maika Library</h1>
          <p className="text-lg md:text-xl opacity-90">Khám phá thế giới sách với lazy loading tối ưu</p>
        </div>
      </div>

      {/* Spacer để tạo khoảng cách scroll */}
      <div className="h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-bounce mb-4">
            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
          <p className="text-xl">Scroll xuống để xem lazy loading hoạt động</p>
          <p className="text-sm opacity-70 mt-2">Components sẽ tải theo thứ tự ưu tiên</p>
        </div>
      </div>

      {/* Latest Books - Priority 1 */}
      <div className="border-t border-gray-700">
        <LatestBooks />
      </div>

      {/* Spacer */}
      <div className="h-64 bg-gray-800 flex items-center justify-center">
        <p className="text-gray-400">Khoảng cách giữa các sections</p>
      </div>

      {/* Book Rank - Priority 2 */}
      <div className="border-t border-gray-700">
        <BookRank />
      </div>

      {/* Spacer */}
      <div className="h-64 bg-gray-800 flex items-center justify-center">
        <p className="text-gray-400">Khoảng cách giữa các sections</p>
      </div>

      {/* Propose - Priority 3 */}
      <div className="border-t border-gray-700">
        <Propose />
      </div>

      {/* Footer */}
      <div className="h-96 bg-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Tối ưu hoàn tất!</h3>
          <p className="text-gray-400">
            Lazy loading với responsive optimization và priority queue
          </p>
        </div>
      </div>
    </div>
  );
};

export default OptimizedHomePage;
