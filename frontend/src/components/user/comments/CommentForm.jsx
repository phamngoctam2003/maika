import React, { useState, useEffect } from "react";

const CommentForm = ({ isOpen, onClose, onSubmit, existingComment = null, isUpdate = false }) => {
  const [formData, setFormData] = useState({
    rating: 5,
    content: ""
  });

  // Populate form with existing comment data when editing
  useEffect(() => {
    if (isUpdate && existingComment) {
      setFormData({
        rating: existingComment.rating || 5,
        content: existingComment.content || ""
      });
    } else {
      setFormData({
        rating: 5,
        content: ""
      });
    }
  }, [isUpdate, existingComment, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    
    // Only reset form if it's a new comment, not an update
    if (!isUpdate) {
      setFormData({ rating: 5, content: "" });
    }
    onClose();
  };

  const handleRatingChange = (value) => {
    setFormData(prev => ({ ...prev, rating: value }));
  };

  const handleContentChange = (e) => {
    setFormData(prev => ({ ...prev, content: e.target.value }));
  };



  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-30"
        onClick={onClose}
      ></div>

      {/* Comment Modal */}
      <div className={`danhgia z-50 ${isOpen ? 'activebtn' : ''}`}>
        <form onSubmit={handleSubmit}>
          <h2>{isUpdate ? 'Chỉnh sửa đánh giá & nhận xét' : 'Đánh giá & Nhận xét'}</h2>
          <span
            className="icon-close1"
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24">
              <path fill="currentColor" d="m7.05 5.636l4.95 4.95l4.95-4.95l1.414 1.414l-4.95 4.95l4.95 4.95l-1.415 1.414l-4.95-4.95l-4.949 4.95l-1.414-1.414l4.95-4.95l-4.95-4.95L7.05 5.636Z" />
            </svg>
          </span>

          <div className="row-radio">
            <label htmlFor="rating">Đánh Giá</label>
            <div className="rating">
              {[5, 4, 3, 2, 1].map((star) => (
                <React.Fragment key={star}>
                  <input 
                    type="radio" 
                    id={`star${star}`} 
                    name="rate" 
                    value={star}
                    checked={formData.rating === star}
                    onChange={() => handleRatingChange(star)}
                  />
                  <label htmlFor={`star${star}`} title={`${star} sao`}>
                    <svg viewBox="0 0 576 512" height="1em" xmlns="http://www.w3.org/2000/svg" className="star-solid">
                      <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path>
                    </svg>
                  </label>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="row-nhanxet">
            <label htmlFor="NhanXet">Nhận xét </label>
            <textarea 
              name="NhanXet" 
              id="nhanxet" 
              maxLength="300"
              value={formData.content}
              onChange={handleContentChange}
              placeholder="Hãy cho chúng mình một vài nhận xét và đóng góp ý kiến nhé"
              required
            />
          </div>
          <button type="submit" className="btn-sub">
            {isUpdate ? 'Cập nhật nhận xét' : 'Gửi nhận xét'}
          </button>
        </form>
      </div>
    </>
  );
};

export default CommentForm;
