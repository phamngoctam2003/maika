import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import HomeService from "@/services/users/api-home";
import useInView from "@/hooks/useInView";
import BookSkeleton from "@/components/ui/BookSkeleton";
import { BookCard } from "@components/user/books/bookcard";

export const LazyCategoryBooks = ({
    categorySlug,
    categoryName,
    limit = 12,
    showViewAll = true
}) => {
    const [books, setBooks] = useState([]);
    const [hasLoadedData, setHasLoadedData] = useState(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [scrollDistance, setScrollDistance] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const scrollRef = useRef(null);
    const itemRef = useRef(null);

    const fetchData = async () => {
        if (hasLoadedData) return;
        try {
            const response = await HomeService.getBooksByCategory(categorySlug, limit);
            setBooks(response?.data || response || []);
            console.log("Fetched books:", response?.data || response || []);
            setHasLoadedData(true);
        } catch (error) {
            setBooks([]);
            setHasLoadedData(true);
        }
    };

    const { elementRef, hasLoaded, loading } = useInView(fetchData);

    const checkScrollability = () => {
        if (scrollRef.current) {
            const container = scrollRef.current;
            const scrollLeft = container.scrollLeft;
            const scrollWidth = container.scrollWidth;
            const clientWidth = container.clientWidth;

            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1); // -1 để tránh lỗi float
        }
    };

    useEffect(() => {
        if (itemRef.current && scrollRef.current) {
            const item = itemRef.current;
            const container = scrollRef.current;

            // Lấy style computed của container để biết gap
            const containerStyle = window.getComputedStyle(container);
            const gap = parseFloat(containerStyle.gap) || 16; // fallback to 16px if gap not found

            // Tính toán khoảng cách để cuộn qua 4 items
            // itemWidth + gap, nhưng item cuối cùng không có gap
            const itemWidth = item.offsetWidth;
            const distanceFor4Items = (itemWidth + gap) * 5 - gap;

            setScrollDistance(distanceFor4Items);


            // Kiểm tra khả năng cuộn ban đầu
            checkScrollability();

            // Thêm event listener cho scroll
            container.addEventListener('scroll', checkScrollability);

            return () => {
                container.removeEventListener('scroll', checkScrollability);
            };
        }
    }, [books]);

    const scroll = (direction) => {
        if (scrollRef.current && scrollDistance > 0) {
            const container = scrollRef.current;
            const currentScrollLeft = container.scrollLeft;

            if (direction === "left") {
                container.scrollBy({
                    left: -scrollDistance,
                    behavior: "smooth",
                });
            } else {
                container.scrollBy({
                    left: scrollDistance,
                    behavior: "smooth",
                });
            }
        }
    };

    return (
        <div ref={elementRef} className="py-2 lg:py-8 w-full">
            <div className="pl-4 lg:pl-12 w-full">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl md:text-2xl font-bold mb-2 lg:mb-6 text-white">
                        {categoryName}
                    </h2>
                </div>
                {loading && !hasLoadedData && <BookSkeleton count={8} />}
                {hasLoadedData && books.length > 0 && (
                    <div
                        className="relative"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {/* Nút cuộn trái */}
                        {canScrollLeft && (
                            <button
                                onClick={() => scroll("left")}
                                style={{
                                    border: '1px solid rgba(255, 255, 255, 1)',
                                }}
                                className={`absolute xl:-left-6 -left-8 top-1/2 -translate-y-1/2 z-10 bg-gray-500 bg-opacity-35 hover:bg-opacity-20 text-white rounded-full p-2 transition-all duration-300 backdrop-blur-sm ${isHovered ? 'opacity-100 visible' : 'opacity-0 invisible '
                                    } hidden lg:block`}
                                aria-label="Trượt sang trái"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M31 36L19 24l12-12" /></svg>
                            </button>
                        )}
                        <div
                            ref={scrollRef}
                            className="flex overflow-x-auto gap-2 md:gap-4 xl:gap-6 scrollbar-hide [overflow-scrolling:touch] pr-4 lg:pr-12">
                            {books.map((book, idx) => (
                                <BookCard
                                    key={book.id}
                                    book={book}
                                    link={`/ebook/${book.slug}`}
                                    ref={idx === 0 ? itemRef : null}
                                />
                            ))}
                        </div>
                        {/* Nút cuộn phải */}
                        {canScrollRight && (
                            <button
                                style={{
                                    border: '1px solid rgba(255, 255, 255, 1)',
                                }}
                                onClick={() => scroll("right")}
                                className={`absolute xl:right-6 right-4 top-1/2 -translate-y-1/2 z-10 bg-gray-500 bg-opacity-35 hover:bg-opacity-20 text-white rounded-full p-2 transition-all duration-300 backdrop-blur-sm ${isHovered ? 'opacity-100 visible' : 'opacity-0 invisible'
                                    } hidden lg:block`}
                                aria-label="Trượt sang phải"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 48 48" className="relative z-10">
                                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 12L31 24L19 36" />
                                </svg>
                            </button>
                        )}
                    </div>
                )}

                {hasLoadedData && books.length === 0 && (
                    <p className="text-center text-gray-400 py-8">
                        Không có sách nào trong danh mục "{categoryName}".
                    </p>
                )}
            </div>
        </div>
    );
};
