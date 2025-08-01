import React, { useState, useContext, useEffect } from "react";
import { message } from 'antd';
import { useAuth } from "@/contexts/authcontext";
import BookCaseService from '@/services/users/api-bookcase';

const AddToBookCaseButton = ({ bookId, isSavedInitially = false }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { isAuthenticated } = useAuth();
    const [isSaved, setIsSaved] = useState(isSavedInitially); // Trạng thái đã lưu

    console.log('isSavedInitially:', isSavedInitially);
    console.log('isSaved:', isSaved);
    useEffect(() => {
        setIsSaved(isSavedInitially);
    }, [isSavedInitially]);

    const handleToggleSave = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            message.info('Vui lòng đăng nhập để sử dụng tính năng này.');
            return;
        }

        setIsLoading(true);
        try {
            if (!isSaved) {
                const response = await BookCaseService.addToBookCase(bookId); // Thêm sách
                message.success(response.message || 'Đã lưu sách!');
                setIsSaved(true);
                isSavedInitially = true;
            } else {
                // Nếu sách đã được lưu, gọi API để xóa
                const response = await BookCaseService.removeFromBookCase(bookId);
                message.success(response.message || 'Đã bỏ lưu sách!');
                setIsSaved(false);
            }
        } catch (error) {
            const errorMessage = error.response?.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
            message.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggleSave}
            disabled={isLoading}
        >
            {isSaved ? (
                <svg className="text-red-500" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 20 20">
                    <path fill="currentColor" d="m10 3.22l-.61-.6a5.5 5.5 0 0 0-7.78 7.77L10 18.78l8.39-8.4a5.5 5.5 0 0 0-7.78-7.77l-.61.61z" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 1024 1024">
                    <path fill="currentColor" d="M287.984 114.16c31.376 0 88.094 15.008 180.094 105.616l45.616 44.912l44.928-45.632c63.872-64.896 131.84-105.2 177.376-105.2c61.408 0 109.809 21.008 157.009 68.096c44.464 44.368 68.992 103.36 68.992 166.112c.032 62.784-24.448 121.824-69.408 166.672c-3.664 3.712-196.992 212.304-358.96 387.104c-7.632 7.248-16.352 8.32-20.991 8.32c-4.576 0-13.2-1.024-20.8-8.096c-39.472-43.905-325.552-362-358.815-395.232C88.497 462.416 64 403.376 64 340.608c.015-62.752 24.511-121.728 69.04-166.144c43.295-43.264 93.984-60.304 154.944-60.304zm-.002-64c-76.528 0-144 22.895-200.176 79.008c-117.072 116.768-117.072 306.128 0 422.96c33.424 33.44 357.855 394.337 357.855 394.337c18.48 18.496 42.753 27.68 66.96 27.68c24.225 0 48.4-9.184 66.912-27.68c0 0 354.88-383.024 358.656-386.85c117.04-116.88 117.04-306.24 0-423.007c-58.112-58-123.024-86.784-202.208-86.784c-75.648 0-160 60.32-223.008 124.32C447.981 110.159 366.237 50.16 287.981 50.16z" />
                </svg>
            )}
        </button>
    );
};

export default AddToBookCaseButton;
