import React from 'react';

const BookProgress = ({ currentChapterData, getCurrentAbsolutePage, getTotalPages, handleProgressChange }) => {
  const currentPercent = Math.round((getCurrentAbsolutePage() / getTotalPages()) * 100);

  return (
    <div className="p-4 border-t border-gray-700 w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">{currentChapterData.title.split(':')[1]?.trim() || 'Lời ngỏ'}</span>
        <span className="text-sm text-gray-400">{currentPercent}%</span>
      </div>
      <div className="relative">
        <input
          type="range"
          min="0"
          max="100"
          value={currentPercent}
          onChange={handleProgressChange}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>Trang {getCurrentAbsolutePage()} / {getTotalPages()}</span>
        <span>{currentChapterData.title}</span>
      </div>
    </div>
  );
};

export default BookProgress;
