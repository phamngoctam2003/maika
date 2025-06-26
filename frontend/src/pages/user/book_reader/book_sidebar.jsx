
const BookSidebar = ({ chapters }) => {
  const URL_IMG = import.meta.env.VITE_URL_IMG;

  return (
    <div className={`w-80 transition-all duration-300 bg-gray-800 border-r lg:block hidden border-gray-700 flex-col overflow-hidden md:relative absolute z-[9] h-full mt-16`}>
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-28 rounded-md flex items-center justify-center text-center">
            <img className="object-cover rounded-md" src={URL_IMG + chapters.file_path} alt="" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">{chapters.title}</h2>
            <p className="text-gray-400 text-sm">
              {chapters.authors.map(author => (
                <span key={author.id} className="block">{author.name}</span>
              ))}
            </p>
          </div>
        </div>
      </div>
      <div className="p-6 flex-1 overflow-y-auto">
        <h3 className="font-semibold mb-3 text-center">Sách hội viên</h3>
                <div className="bg-teal-500 text-white px-4 py-3 rounded-full text-sm text-center">
          Trở thành hội viên (1.000đ/ngày)
        </div>
        <p className="text-sm text-gray-300 leading-relaxed mt-4">
          {chapters.description}
        </p>
      </div>
    </div>
  )
};

export default BookSidebar;
