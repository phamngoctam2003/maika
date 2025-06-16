import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const images = [
    '/images/image1.png',
    '/images/image1.png',
    '/images/image2.png',
    '/images/image3.png',
    '/images/image3.png',
    '/images/image2.png',
    '/images/image1.png',

];

const SlideCarousel = () => {
    return (
        <div className="w-full h-auto max-w-6xl mx-auto py-6 lg:hidden cursor-pointer overflow-hidden pt-24 sile-carousel">
            <Swiper
                modules={[Navigation, Pagination]}
                slidesPerView={1.6}
                centeredSlides={true}
                loop={true}
                className="my-custom-swiper"
                breakpoints={{
                    320: {
                        slidesPerView: 1.7,
                    },
                    640: {
                        slidesPerView: 1.8,
                    },
                    768: {
                        slidesPerView: 2,
                    },
                    1024: {
                        slidesPerView: 2,
                    },
                }}
            >
                {images.map((src, index) => (
                    <SwiperSlide
                        key={index}
                        className="flex justify-center items-center w-full h-auto select-none"
                    >
                        <div className="xs:h-[350px] xs:w-[220px]  w-[280px] h-[440px] sm:w-[320px] sm:h-[500px] md:w-[360px] md:h-[560px] lg:w-[400px] lg:h-[620px] bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 mx-auto">
                            <img
                                src={src}
                                alt={`Slide ${index + 1}`}
                                className="object-cover w-full h-full transition-transform"
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default SlideCarousel;