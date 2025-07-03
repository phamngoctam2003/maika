import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const CommentItem = ({ comment }) => {
    const URL_IMG = import.meta.env.VITE_URL_IMG;
  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true, 
        locale: vi 
      });
    } catch (error) {
      return 'Vừa xong';
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        viewBox="0 0 576 512"
        height="14px"
        width="14px"
        xmlns="http://www.w3.org/2000/svg"
        className={`inline-block ${index < rating ? 'text-yellow-400' : 'text-gray-400'}`}
        fill="currentColor"
      >
        <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path>
      </svg>
    ));
  };

  return (
    <div className="form-danhgia">
      <div className="img-name">
        <div className="flex-pp">
          <img 
            src={URL_IMG + comment.user?.image || "/images/default-avatar.png"} 
            alt={comment.user?.fullName || "User"}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="ml-3">
            <p className="text-white-50 font-medium text-sm">
              {comment.user?.fullName || "Người dùng ẩn danh"}
            </p>
            {comment.rating && (
              <div className="flex items-center gap-1 mt-1">
                {renderStars(comment.rating)}
                <span className="text-xs text-gray-400 ml-1">({comment.rating}/5)</span>
              </div>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">
            {formatDate(comment.created_at)}
          </p>
          {comment.is_admin === 1 && (
            <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">
              Admin
            </span>
          )}
        </div>
      </div>
      
      <div className="comment-form mt-3">
        <p className="text-white-300 leading-relaxed">
          {comment.content}
        </p>
        
        {/* Action buttons */}
        {/* <div className="flex items-center gap-4 mt-3 text-sm">
          <button className="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 10v12l4-2 4 2V10"/>
              <path d="M5 6h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/>
            </svg>
            Thích
          </button>
          <button className="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
            Trả lời
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default CommentItem;
