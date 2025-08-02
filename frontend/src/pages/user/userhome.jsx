import SlideCarousel from "../../components/ui/slide_swiper";
import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LatestBooks } from "@components/user/home/latest_books";
import { BookRank } from "@components/user/home/book_rank";
import { Propose } from "@components/user/home/propose";
import { DynamicCategoryBooks } from "@components/user/home/category/dynamic_category_books";
import TestAPI from "@components/debug/TestAPI";
import LazyLoadMonitor from "@components/debug/LazyLoadMonitor";

const UserHome = () => {
  // Hiển thị categories động từ API

  return (
    <>
      <SlideCarousel />
      <LatestBooks/>
      <BookRank/>
      <Propose/>
      
      {/* Hiển thị categories động */}
      <DynamicCategoryBooks />
    </>
  );
}

export default UserHome;