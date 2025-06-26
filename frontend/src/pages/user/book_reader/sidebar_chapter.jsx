
const SidebarChapter = ({ sidebarOpen, toggleSidebar, books, currentChapter, onChapterChange }) => {
  return (
    <div className={`mt-16 w-80 transition-all duration-300 bg-gray-800 border-r flex border-gray-700 flex-col overflow-hidden absolute z-[20] h-full ${sidebarOpen ? 'right-0 translate-x-0' : 'right-0 translate-x-full'
      }`}>
      <div className="p-4 flex-1 overflow-y-auto">
        <h3 className="font-semibold mb-3">Danh sách</h3>
        <div className=" text-sm">
          Mục lục
        </div>
        <div className="mt-4">
          {books.chapters.map((chapter, index) => (
            <div 
              key={index} 
              className={`py-2 px-3 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors ${
                currentChapter === index ? 'bg-blue-600 text-white' : 'text-gray-300'
              }`} 
              onClick={() => {
                onChapterChange(index);
                toggleSidebar();
              }}
            >
              <span>{chapter.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
};

export default SidebarChapter;
