import React, { createContext, useState, useEffect, useContext } from 'react';
import { AntNotification } from "@components/global/notification";
const BookContext = createContext(null);

export const BookProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [openAudioModal, setOpenAudioModal] = useState(false);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false); // Đổi từ true thành false
    const [currentBook, setCurrentBook] = useState(null);
    const [error, setError] = useState(null);
    /**
     * Refresh thông tin user và gói hội viên
     * Dùng khi user vừa mua gói mới hoặc cần cập nhật thông tin
     */

    const value = {
        // Thông tin gói hội viên
        loading,
        error,
        openAudioModal,
        isAudioPlaying,
        currentBook,
        setCurrentBook,
        setIsAudioPlaying,
        setOpenAudioModal,
        setLoading,
        setError,
    };

    return (
        <BookContext.Provider value={value}>
            {children}
        </BookContext.Provider>
    );
};

// Custom hook để sử dụng BookContext
export const useBook = () => {
    const context = useContext(BookContext);
    if (!context) {
        throw new Error('useBook must be used within a BookProvider');
    }
    return context;
};