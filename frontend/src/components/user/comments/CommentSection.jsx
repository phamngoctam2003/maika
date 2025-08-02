import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/authcontext";
import { message } from "antd";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import DetailService from "@/services/users/api-detail";

const CommentSection = ({ 
  comments = [], 
  onAddComment, 
  loading = false, 
  bookId,
  hasMoreComments = false,
  onLoadMore,
  totalComments = 0
}) => {
  const [isCommentFormOpen, setIsCommentFormOpen] = useState(false);
  const [userComment, setUserComment] = useState(null);
  const [hasCommented, setHasCommented] = useState(false);
  const { isAuthenticated, currentUser } = useAuth();

  // Check if user has already commented when component mounts
  useEffect(() => {
    const checkUserComment = async () => {
      if (isAuthenticated && bookId) {
        try {
          const response = await DetailService.checkUserComment(bookId);
          setHasCommented(response.hasCommented);
          setUserComment(response.comment);
        } catch (error) {
          console.error("Error checking user comment:", error);
        }
      }
    };

    checkUserComment();
  }, [isAuthenticated, bookId]);

  const handleOpenCommentForm = () => {
    if (!isAuthenticated) {
      message.error("Vui lòng đăng nhập để viết đánh giá");
      return;
    }
    setIsCommentFormOpen(true);
  };

  const handleCloseCommentForm = () => {
    setIsCommentFormOpen(false);
  };

  const handleSubmitComment = async (commentData) => {
    if (!isAuthenticated) {
      message.error("Vui lòng đăng nhập để viết đánh giá");
      return;
    }
    
    try {
      const result = await onAddComment(commentData);
      
      // Update local state based on response
      if (result?.isUpdate) {
        setUserComment(result.comment);
        message.success("Đã cập nhật đánh giá của bạn");
      } else {
        setHasCommented(true);
        setUserComment(result.comment || result);
        message.success("Đã thêm đánh giá của bạn");
      }
      
      // Form will be closed automatically by CommentForm component
    } catch (error) {
      console.error("Error submitting comment:", error);
      // Error handling is already done in book_detail.jsx
    }
  };

  return (
    <div>
      <div className="flex gap-6 py-3 tabs border-white-overlay pb-4 border-b border-white-overlay">
        <div className="cursor-pointer flex items-center">
          <p className="leading-5 font-normal text-white-300">
            Đánh giá &amp; nhận xét ({totalComments})
          </p>
        </div>
      </div>

      <div className="comment">
        {/* Comment Form Button */}
        <div className="danhgia-button">
          <button
            onClick={handleOpenCommentForm}
            className={`btn113 text-sm lg:text-base px-2  gap-2 ${!isAuthenticated ? 'opacity-75 hover:opacity-100' : ''}`}
            title={!isAuthenticated ? 'Vui lòng đăng nhập để viết đánh giá' : ''}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="28" 
              height="28" 
              viewBox="0 0 16 16"
            >
              <path 
                fill="currentColor" 
                fillRule="evenodd" 
                d="M6.169 6.331a3 3 0 0 0-.833 1.6l-.338 1.912a1 1 0 0 0 1.159 1.159l1.912-.338a3 3 0 0 0 1.6-.833l3.07-3.07l2-2A.894.894 0 0 0 15 4.13A3.13 3.13 0 0 0 11.87 1a.894.894 0 0 0-.632.262l-2 2l-3.07 3.07Zm3.936-1.814L7.229 7.392a1.5 1.5 0 0 0-.416.8L6.6 9.4l1.208-.213l.057-.01a1.5 1.5 0 0 0 .743-.406l2.875-2.876a1.63 1.63 0 0 0-1.378-1.378m2.558.199a3.143 3.143 0 0 0-1.379-1.38l.82-.82a1.63 1.63 0 0 1 1.38 1.38l-.82.82ZM8 2.25a.75.75 0 0 0-.75-.75H4.5a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h7a3 3 0 0 0 3-3V8.75a.75.75 0 0 0-1.5 0v2.75a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 11.5v-7A1.5 1.5 0 0 1 4.5 3h2.75A.75.75 0 0 0 8 2.25" 
                clipRule="evenodd" 
              />
            </svg>
            <p>
              {!isAuthenticated 
                ? 'Đăng nhập để viết đánh giá' 
                : (hasCommented ? 'Chỉnh sửa đánh giá' : 'Viết đánh giá')
              }
            </p>
          </button>
        </div>

        {/* Login suggestion for non-authenticated users */}
        {!isAuthenticated && (
          <div className="my-4 p-4 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg border border-blue-500/30">
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/>
                <path d="M12 8h.01"/>
              </svg>
              <div>
                <h4 className="text-white-50 font-medium mb-1">Chưa đăng nhập?</h4>
                <p className="text-gray-300 text-sm">
                  Đăng nhập để chia sẻ đánh giá của bạn về cuốn sách này và tham gia thảo luận với cộng đồng độc giả.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Show user's current comment if exists */}
        {hasCommented && userComment && (
          <div className="mt-2 p-4 bg-gray-800 rounded-lg border-l-4 border-blue-500">
            <h4 className="text-white-50 font-medium mb-2">Đánh giá của bạn:</h4>
            <CommentItem comment={userComment} />
          </div>
        )}

        {/* Comment Form Modal - Only show if authenticated */}
        {isAuthenticated && (
          <CommentForm
            isOpen={isCommentFormOpen}
            onClose={handleCloseCommentForm}
            onSubmit={handleSubmitComment}
            existingComment={userComment}
            isUpdate={hasCommented}
          />
        )}

        {/* Comments List */}
        { comments.length > 0 ? (
          <div className="space-y-2 my-2">
            {comments.map((comment, index) => (
              <CommentItem key={comment.id || index} comment={comment} />
            ))}
            
            {/* Load More Button */}
            {hasMoreComments && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={onLoadMore}
                  disabled={loading}
                  className="px-6 py-3 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang tải...</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6,9 12,15 18,9"></polyline>
                      </svg>
                      <span>Xem thêm</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="my-5">
            <div className="flex items-center justify-center flex-col">
              <img
                src="/images/png/comment-empty.png"
                alt="No comments"
                className="cursor-pointer"
              />
              <p className="text-16-16 text-white-400">
                Chưa có bình luận & đánh giá nào
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
