import React, { useState, useEffect, useRef  } from 'react';

export const Slideshow = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef(null);
    const items = [
        "https://307a0e78.vws.vegacdn.vn/view/v2/image/img.banner_web_v2/0/0/0/3859.jpg?v=1&w=1920&h=600",
        "https://307a0e78.vws.vegacdn.vn/view/v2/image/img.banner_web_v2/0/0/0/3859.jpg?v=1&w=1920&h=600",
        "https://307a0e78.vws.vegacdn.vn/view/v2/image/img.banner_web_v2/0/0/0/3859.jpg?v=1&w=1920&h=600",
        "https://307a0e78.vws.vegacdn.vn/view/v2/image/img.banner_web_v2/0/0/0/3859.jpg?v=1&w=1920&h=600"
    ];

    useEffect(() => {
        timeoutRef.current = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
        }, 5000);
        return () => clearInterval(timeoutRef.current);
    }, [currentIndex, items.length]);

    const handleNextClick = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);  // Sử dụng modulo để quay lại đầu
        resetTimeout();
    };

    const handlePrevClick = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);  // Sử dụng modulo để quay lại cuối
        resetTimeout();
    };
    const resetTimeout = () => {
        clearInterval(timeoutRef.current);
        timeoutRef.current = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
        }, 5000);
    };
    return (
        <div className="slider mb-4">
            <div className="list" style={{ transform: `translateX(-${currentIndex * 100}%)`, transition: "transform 1s ease" }}>
                {items.map((src, index) => (
                    <div className="item" key={index}>
                        <img src={src} alt={`Slide ${index}`} />
                    </div>
                ))}
            </div>
            <div className="buttons">
                <button id="prev" onClick={handlePrevClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z"></path>
                    </svg>
                </button>
                <button id="next" onClick={handleNextClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z"></path>
                    </svg>
                </button>
            </div>
        </div>
    );
};


