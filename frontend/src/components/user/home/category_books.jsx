import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import HomeService from "@/services/users/api-home";
import useInView from "@/hooks/useInView";
import BookSkeleton from "@/components/ui/BookSkeleton";

export const CategoryBooks = ({
    categorySlug,
    categoryName,
    limit = 12,
    showViewAll = true
}) => {
    const URL_IMG = import.meta.env.VITE_URL_IMG;
    const [books, setBooks] = useState([]);

    const scrollRef = useRef(null);
    const itemRef = useRef(null);
    const [scrollDistance, setScrollDistance] = useState(0);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [isHovered, setIsHovered] = useState(false);

    const fetchData = async () => {
        try {
            const response = await HomeService.getBooksByCategory(categorySlug, limit);
            setBooks(response || []);
        } catch (error) {
            setBooks([]);
        }
    };

    useEffect(() => {
        fetchData();
    }, [categorySlug, categoryName, limit]);


    const checkScrollability = () => {
        if (scrollRef.current) {
            const container = scrollRef.current;
            const scrollLeft = container.scrollLeft;
            const scrollWidth = container.scrollWidth;
            const clientWidth = container.clientWidth;

            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    useEffect(() => {
        if (itemRef.current && scrollRef.current) {
            const item = itemRef.current;
            const container = scrollRef.current;

            const containerStyle = window.getComputedStyle(container);
            const gap = parseFloat(containerStyle.gap) || 16;

            const itemWidth = item.offsetWidth;
            const distanceFor4Items = (itemWidth + gap) * 5 - gap;

            setScrollDistance(distanceFor4Items);
        }

        checkScrollability();
    }, [books]);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const container = scrollRef.current;
            const scrollAmount = direction === "left" ? -scrollDistance : scrollDistance;

            container.scrollTo({
                left: container.scrollLeft + scrollAmount,
                behavior: "smooth",
            });

            setTimeout(checkScrollability, 300);
        }
    };


    return (
        <div className="py-2 lg:py-8 w-full">
            <div className="pl-4 lg:pl-12 w-full">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl md:text-2xl font-bold mb-2 lg:mb-6 text-white">
                        {categoryName}
                    </h2>
                    {showViewAll && (
                        <Link
                            to={`/category/${categorySlug}`}
                            className="text-maika-500 hover:text-maika-400 font-medium text-sm lg:text-base transition-colors pr-4 lg:pr-12"
                        >
                            Xem tất cả →
                        </Link>
                    )}
                </div>

                {/* Books list - hiển thị khi có sách */}
                {books.length > 0 && (
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
                                className={`absolute xl:-left-6 -left-8 top-1/2 -translate-y-1/2 z-10 bg-gray-500 bg-opacity-35 hover:bg-opacity-20 text-white rounded-full p-2 transition-all duration-300 backdrop-blur-sm ${isHovered ? 'opacity-100 visible' : 'opacity-0 invisible'
                                    } hidden lg:block`}
                                aria-label="Trượt sang trái"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 48 48">
                                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M31 36L19 24l12-12" />
                                </svg>
                            </button>
                        )}

                        <div
                            ref={scrollRef}
                            className="flex overflow-x-auto gap-2 md:gap-4 xl:gap-6 scrollbar-hide [overflow-scrolling:touch] pr-4 lg:pr-12"
                            onScroll={checkScrollability}
                        >
                            {books.map((book, idx) => (
                                <div
                                    ref={idx === 0 ? itemRef : null}
                                    className="flex-none w-[120px] md:w-[120px] lg:w-[150px] xl:w-[180px] 2xl:w-[244px] cursor-pointer"
                                    key={book.id}
                                >
                                    <div>
                                        <Link
                                            to={`/ebook/${book.slug}`}
                                            className="block h-auto"
                                        >
                                            <div className="relative w-full mb-2 rounded-md lg:rounded-xl shadow-md overflow-hidden">
                                                <img
                                                    className="w-full h-auto object-cover"
                                                    src={URL_IMG + book.file_path}
                                                    alt={book.title}
                                                    loading="lazy"
                                                />
                                                {book?.access_type === 'member' && (
                                                    <div className="absolute top-0 right-0 xl:pl-3 type-member xl:pr-8 2xl:pr-10 xl:w-30 h-7">
                                                        <p className="py-1 font-medium uppercase text-16-16 text-white-default xl:block hidden">Hội viên</p>
                                                        <svg className="cursor-pointer absolute top-0 right-0 2xl:w-10 lg:w-8 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 35" fill="none">
                                                            <g filter="url(#filter0_d_2906_37719)">
                                                                <path d="M23 0C29.6274 0 35 5.37258 35 12V29.146C31.8622 30.9611 28.2191 32 24.3333 32C12.5513 32 3 22.4487 3 10.6667C3 6.78094 4.03887 3.13785 5.85402 0H23Z" fill="white" />
                                                            </g>
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M21.6473 5.58079C21.498 5.3732 21.2569 5.25 21 5.25C20.7431 5.25 20.502 5.3732 20.3527 5.58079L16.625 10.875L13.4012 8.88808C13.1273 8.7521 12.7992 8.78429 12.5574 8.97087C12.3156 9.15745 12.2031 9.46529 12.2682 9.76242L14.2568 19.6279C14.3363 19.991 14.6599 20.25 15.0341 20.25H26.9659C27.3401 20.25 27.6637 19.991 27.7432 19.6279L29.7318 9.76242C29.7969 9.46529 29.6844 9.15745 29.4426 8.97087C29.2008 8.78429 28.8727 8.7521 28.5988 8.88808L25.375 10.875L21.6473 5.58079ZM21 16.5C22.3807 16.5 23.5 15.3807 23.5 14C23.5 12.6193 22.3807 11.5 21 11.5C19.6193 11.5 18.5 12.6193 18.5 14C18.5 15.3807 19.6193 16.5 21 16.5Z" fill="url(#paint0_linear_2906_37719)" />
                                                            <defs>
                                                                <filter id="filter0_d_2906_37719" x="0" y="-1" width="36" height="36" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                                                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                                                    <feOffset dx="-1" dy="1" />
                                                                    <feGaussianBlur stdDeviation="1" />
                                                                    <feComposite in2="hardAlpha" operator="out" />
                                                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
                                                                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2906_37719" />
                                                                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2906_37719" result="shape" />
                                                                </filter>
                                                                <linearGradient id="paint0_linear_2906_37719" x1="29.75" y1="12.75" x2="12.25" y2="12.75" gradientUnits="userSpaceOnUse">
                                                                    <stop stopColor="#FB3A1A" />
                                                                    <stop offset="1" stopColor="#EBB004" />
                                                                </linearGradient>
                                                            </defs>
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <p
                                                style={{ textOverflow: 'ellipsis' }}
                                                className="text-sm lg:text-base font-semibold text-gray-100 hover:text-maika-500 line-clamp-2"
                                            >
                                                {book?.title}
                                            </p>

                                            {/* Hiển thị tác giả */}
                                            {/* {book.authors && book.authors.length > 0 && (
                                                <p className="text-xs lg:text-sm text-gray-400 mt-1 line-clamp-1">
                                                    {book.authors.map(author => author.name).join(', ')}
                                                </p>
                                            )} */}
                                        </Link>
                                    </div>
                                </div>
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
            </div>
        </div>
    );
};
