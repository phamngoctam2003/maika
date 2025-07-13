const BookSkeleton = ({ count = 8 }) => {
  return (
    <div className="flex overflow-x-auto gap-4 scrollbar-hide [overflow-scrolling:touch] pr-4 lg:pr-12">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="flex-none w-[120px] md:w-[120px] lg:w-[150px] xl:w-[180px] 2xl:w-[244px] cursor-pointer"
        >
          <div className="">
            <div className="relative w-full mb-2 rounded-md lg:rounded-xl shadow-md overflow-hidden aspect-[2/3] bg-gray-600">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-500/20 to-transparent animate-shimmer"></div>
            </div>
            
            {/* Skeleton cho tiêu đề */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-500/20 to-transparent animate-shimmer"></div>
              </div>
              <div className="h-4 bg-gray-700 rounded w-3/4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-500/20 to-transparent animate-shimmer"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookSkeleton;
