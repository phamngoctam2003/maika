import { Link } from "react-router-dom";
import { forwardRef } from "react";

export const BookCardCategory = ({ book, link }) => {
  const URL_IMG = import.meta.env.VITE_URL_IMG;

  return (
    <Link
      to={`${link}`}
      className="w-full cursor-pointer block overflow-hidden"
    >
      <div className="relative w-full mb-2 aspect-[2/3] shadow-md rounded-md lg:rounded-xl overflow-hidden">
        <img
          src={`${URL_IMG}${book.file_path}`}
          alt={book.title}
          className="w-full h-full object-cover rounded-md lg:rounded-xl"
          loading="lazy"
        />
        {book?.access_type === 'member' && (
          <div className="absolute top-0 right-0 flex items-center justify-center type-member h-7">
            <p className=" px-2 font-medium uppercase text-xs xl:text-sm text-white-default text-center">Hội viên</p>
            <svg className="cursor-pointer w-10 mt-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 35" fill="none">
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
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
      </div>
      <p
        style={{ textOverflow: 'ellipsis' }}
        className="text-sm lg:text-base font-semibold text-gray-100 hover:text-maika-500 line-clamp-2"
      >
        {book?.title}
      </p>
    </Link>
  );
}

export const BookCard = forwardRef(({ book, link }, ref) => {
  const URL_IMG = import.meta.env.VITE_URL_IMG;
  return (
    <Link
      ref={ref}
      to={`${link}`}
      className="aspect-[3/4] flex-none w-[120px] md:w-[120px] lg:w-[150px] xl:w-[180px] 2xl:w-[244px] cursor-pointer"
    >
      <div className="relative w-full mb-2 rounded-md lg:rounded-xl shadow-md overflow-hidden">
        <img
          src={`${URL_IMG}${book.file_path}`}
          alt={book.title}
          className="w-full h-full object-cover"
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
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
      </div>
      <p
        style={{ textOverflow: 'ellipsis' }}
        className="text-sm lg:text-base font-semibold text-gray-100 hover:text-maika-500 line-clamp-2"
      >
        {book?.title}
      </p>
    </Link>
  );
});
