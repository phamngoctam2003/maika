import SlideCarousel from "../../components/ui/slide_swiper";
import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import HomeService from "../../services/client/api-home";

const UserHome = () => {
  const URL_IMG = import.meta.env.VITE_URL_IMG;
  const [latestBooks, setLatestBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestBooks = async () => {
      try {
        const response = await HomeService.getLatets();
        setLatestBooks(response);
      } catch (error) {
        console.error("Failed to fetch:", error);
      }
    };
    fetchLatestBooks();
  }, []);

  const scrollRef = useRef(null);
  const itemRef = useRef(null);
  const [scrollDistance, setScrollDistance] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Kiểm tra khả năng cuộn
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
  }, [latestBooks]);

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
    <>
      <SlideCarousel />
      <div className="py-4 lg:py-10 w-full">
        <div className="pl-4 lg:pl-12 w-full">
          <h2 className="text-1xl md:text-2xl font-bold mb-2 lg:mb-6">Mới nhất</h2>
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
              className="flex overflow-x-auto gap-4 scrollbar-hide [overflow-scrolling:touch] pr-4 lg:pr-12"
            >
              {latestBooks.map((book, idx) => (
                <div
                  ref={idx === 0 ? itemRef : null}
                  className="flex-none w-[120px] md:w-[120px] lg:w-[150px] xl:w-[180px] 2xl:w-[244px] cursor-pointer"
                  key={book.id}
                >
                  <div className="">
                    <a href="#" className="block h-auto">
                      <div className="relative w-full mb-2 rounded-md lg:rounded-xl shadow-md overflow-hidden">
                        <img
                          className="w-full h-auto object-cover"
                          src={URL_IMG + book.file_path}
                          alt={book.title}
                          loading="lazy"
                        />
                      </div>
                      <p
                        style={{ textOverflow: 'ellipsis' }}
                        className="text-xs xs:text-sm sm:text-base font-semibold text-gray-100 hover:text-maika-500 line-clamp-2"
                      >
                        {book?.title}
                      </p>
                    </a>
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
        </div>
      </div>
    </>
  );
}

export default UserHome;