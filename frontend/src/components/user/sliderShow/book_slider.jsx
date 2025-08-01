import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectCoverflow, Autoplay } from 'swiper/modules';
import { Select } from 'antd';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
export default function BookSlider({ books, categoryId, categoryOptions }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isLargeScreen, setIsLargeScreen] = useState(false);
    const navigate = useNavigate();
    const URL_IMG = import.meta.env.VITE_URL_IMG;
    const handleCategoryChange = (value, option) => {
        navigate(`${option.link}`);
    };
    const [currentFormat, setCurrentFormat] = useState('Sách');

    useEffect(() => {
        const checkScreenSize = () => {
            setIsLargeScreen(window.innerWidth >= 1280); // xl breakpoint
        };
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    useEffect(() => {
        const pathname = window.location.pathname;
        if (pathname.includes('/ebook')) {
            setCurrentFormat('Sách điện tử');
        } else if (pathname.includes('/sach-noi')) {
            setCurrentFormat('Sách nói');
        }
    }, [window.location.pathname]);

    return (
        <>
            <div
                className="relative px-12 pt-28 pb-4 w-full text-white overflow-hidden select-none "
                style={{
                    backgroundImage: `url(${URL_IMG + books[activeIndex]?.file_path})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',

                }}
            >
                {/* Overlay with blur effect */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: `
                            linear-gradient(to bottom, 
                                transparent 0%, 
                                transparent 70%, 
                                rgba(18, 18, 20, 0.98) 100%,
                                rgba(18, 18, 20, 0.1) 10%),
                            linear-gradient(to right, 
                                #121214 20%, 
                                rgba(18, 18, 20, 0.70) 100%, 
                                rgba(18, 18, 20, 0.2) 100%,
                                transparent 100%)`,
                    }}
                ></div>
                <div className="flex gap-4 relative">

                    {/* Left content */}
                    <div className="space-y-4 flex-1 min-w-0 xl:block hidden">
                        <div className="flex items-center mb-4 gap-4">
                            <h2 className="text-3xl md:text-5xl font-bold">
                                {currentFormat}
                            </h2>
                            <Select
                                placeholder="Chọn thể loại"
                                className="custom-select"
                                style={{
                                    width: 300,
                                    height: 45
                                }}
                                value={categoryId}
                                dropdownStyle={{
                                    backgroundColor: '#1f2937'
                                }}
                                onChange={handleCategoryChange}
                                options={categoryOptions}
                            />
                        </div>
                        <p className="bg-gray-700 px-3 py-1 text-xs inline-block rounded-full uppercase font-semibold tracking-wider">
                            Waka đề xuất
                        </p>
                        <h2 className="text-xl md:text-2xl font-bold">
                            {books[activeIndex]?.title}
                        </h2>
                        <p className="text-gray-300 text-sm md:text-base leading-relaxed line-clamp-4">
                            {books[activeIndex]?.description}
                        </p>
                        <div className="mt-4 flex items-center">
                            <button className="bg-emerald-500 hover:bg-emerald-600 transition px-5 py-2 rounded-full text-white font-semibold text-sm">
                                📖 Đọc sách
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center border border-gray-500 rounded-full hover:bg-gray-700 transition">
                                ❤️
                            </button>
                        </div>
                    </div>

                    {/* Right Slider */}
                    <div className="xl:w-[900px] w-full h-auto py-2 cursor-pointer overflow-hidden flex-shrink-0">
                        <Swiper
                            modules={[Navigation, EffectCoverflow, Autoplay]}
                            grabCursor={true}
                            centeredSlides={true}
                            slidesPerView={3.1}
                            loop={true}
                            navigation={isLargeScreen}
                            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                            coverflowEffect={{
                                rotate: 0,
                                stretch: 0,
                                depth: 100,
                                modifier: 2.5,
                                slideShadows: false,
                            }}
                            breakpoints={{
                                320: {
                                    slidesPerView: 2.2,
                                },
                                640: {
                                    slidesPerView: 2.8,
                                },
                                768: {
                                    slidesPerView: 3,
                                },
                                1024: {
                                    slidesPerView: 3.1,
                                },
                            }}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false, // không tắt autoplay khi người dùng thao tác
                            }}
                            className="my-custom-swiper"
                        >
                            {books.map((book, index) => (
                                <SwiperSlide
                                    key={book.id}
                                    className="flex justify-center items-center w-full h-auto select-none"
                                >
                                    <div
                                        className="lg:w-[280px] lg:h-[420px] w-[200px] h-[300px] flex-shrink-0 rounded-xl shadow-lg overflow-hidden transition-all duration-300 mx-auto"
                                    >
                                        <img
                                            src={URL_IMG + book.file_path}
                                            alt={book.title}
                                            className="w-full h-full object-cover rounded-xl shadow-lg"
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </>
    );
}
