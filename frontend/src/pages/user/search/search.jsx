import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import LazySearch from "./lazy_search";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Search = () => {
    const keyword = useQuery().get("keyword") || "";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [keyword]);

    return (
        <>
            <div
                className="relative w-full text-white overflow-hidden select-none"
            >
                <div
                    className="flex lg:px-12 px-4 gap-4 lg:h-[259px] h-[180px] w-full bg-major relative justify-end items-end pb-4">
                    {/* Left content */}
                    <div className="space-y-4 flex-1 min-w-0">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-10">
                            <h2 className="text-2xl md:text-4xl xl:text-5xl font-bold">
                                Kết quả tìm kiếm
                            </h2>
                        </div>
                        <h4 className='font-bold xl:text-xl text-lg lg:block hidden'>Khám phá thế giới sách Waka với hơn 3500+ Sách điện tử và Sách nói</h4>
                    </div>
                </div>
                <LazySearch keyword={keyword} />
            </div>
        </>
    );
};

export default Search;
