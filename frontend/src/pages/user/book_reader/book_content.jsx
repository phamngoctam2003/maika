import React from 'react';

const BookContent = ({ chapter, page, fontSize, brightness }) => (
  <div className="flex-1 p-8 overflow-y-auto scrollbar-hide pt-32">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-yellow-400">
        {chapter.title}
      </h2>
      <div className="text-sm text-gray-400 mb-4">
        Trang {page + 1} / {chapter.pages.length}
      </div>
      <div className="prose prose-invert max-w-none leading-relaxed" style={{ fontSize: `${fontSize}px`, filter: `brightness(${brightness}%)` }}>
        <div 
          className="text-gray-200 leading-loose"
          dangerouslySetInnerHTML={{ __html: chapter.pages[page] }}
        />
      </div>
    </div>
  </div>
);

export default BookContent;
