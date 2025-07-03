import UserBreadcrumb from "@components/user/breadcrumb";
import CommentSection from "@components/user/CommentSection";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AntNotification } from "@components/global/notification";
import DetailtService from "@/services/users/api-detail";
import { Button, Dropdown } from "antd";

const BookDetail = () => {
  const URL_IMG = import.meta.env.VITE_URL_IMG;
  const navigate = useNavigate();
  const { slug } = useParams();
  const [book, setBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [totalComments, setTotalComments] = useState(0);

  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: `${book?.title}`, path: null },
  ];



  const handleAddComment = async (commentData) => {
    try {
      // Call API to add comment
      const response = await DetailtService.create({
        ...commentData,
        book_id: book?.id
      });

      // Handle both new comment and updated comment
      const commentToAdd = response.comment || response;
      const isUpdate = response.isUpdate || false;

      if (isUpdate) {
        // Update existing comment in the list
        setComments(prev => prev.map(comment =>
          comment.id === commentToAdd.id ? commentToAdd : comment
        ));
      } else {
        // Add new comment to the list
        setComments(prev => [commentToAdd, ...prev]);
        setTotalComments(prev => prev + 1);
      }
      return response;
    } catch (error) {
      // Handle specific authentication errors
      if (error?.response?.status === 401) {
        AntNotification.showNotification(
          "Chưa đăng nhập",
          "Vui lòng đăng nhập để viết đánh giá",
          "error"
        );
      } else {
        AntNotification.handleError(
          "Thêm bình luận không thành công",
          error.message || "Đã có lỗi xảy ra khi thêm bình luận"
        );
      }
      throw error;
    }
  };

  const handleLoadMoreComments = () => {
    if (hasMoreComments && !commentsLoading) {
      setCurrentPage(prev => prev + 1);
    }
  };

  useEffect(() => {
    const fecthData = async () => {
      try {
        const response = await DetailtService.getEbook(slug);
        setBook(response);
        // Reset pagination when book changes
        setCurrentPage(1);
        setComments([]);
        setHasMoreComments(true);
        setTotalComments(0);
      } catch (error) {
        console.error("Error fetching latest products:", error);
      }
    };
    fecthData();
  }, [slug]);

  useEffect(() => {
    const fecthDataComment = async () => {
      if (!book?.id) return;

      setCommentsLoading(true);
      try {
        const response = await DetailtService.getComments(book.id, currentPage);
        if (currentPage === 1) {
          // First load - replace all comments
          setComments(response?.data || []);
        } else {
          // Load more - append to existing comments
          setComments(prev => [...prev, ...(response?.data || [])]);
        }

        // Update pagination info
        setTotalComments(response?.total || 0);
        setHasMoreComments(response?.current_page < response?.last_page);

      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setCommentsLoading(false);
      }
    };
    fecthDataComment();
  }, [book?.id, currentPage]);

  const itemAuthors = book?.authors?.map(element => ({
    key: element?.id,
    label: <Link to={`/author/${element.slug}`}>{element?.name}</Link>,
  })) || [];

  const itemCategory = book?.categores?.map(element => ({
    key: element?.id,
    label: <Link to={`/author/${element.slug}`}>{element?.name}</Link>,
  })) || [];

  console.log('category:', book?.categories
  );
  return (
    <div className="lg:px-12 w-full bg-color-detail">
      <UserBreadcrumb items={breadcrumbItems} />
      <div className="relative overflow-hidden block lg:hidden">
        {/* Background image - same as book cover but blurred */}
        <div className="absolute inset-0">
          <img
            src={URL_IMG + book?.file_path}
            alt="Background"
            className="w-full h-full object-cover"
          />
          {/* Blur and dark overlay */}
          <div className="absolute inset-0 backdrop-blur-0 bg-black/70"></div>
        </div>

        {/* Background decorative elements */}
        <div className="absolute top-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>
        <div className="absolute top-40 left-20 w-16 h-16 bg-orange-300/20 rounded-full blur-md"></div>

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between p-4 pt-12">
          <button className="p-2 text-white hover:bg-white/20 rounded-full transition-colors">
          </button>
          <div className="flex gap-3">
            <button className="p-2 text-white hover:bg-white/20 rounded-full transition-colors">
            </button>
            <button className="p-2 text-white hover:bg-white/20 rounded-full transition-colors">
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-5 flex flex-col items-center px-6 mt-8">
          {/* Member badge */}
          {/* <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-4 flex items-center gap-1">
            <span className="w-2 h-2 bg-white rounded-full"></span>
            HỘI VIÊN
          </div> */}

          {/* Book cover */}
          <div className="relative mb-6">
            <img
              src={URL_IMG + book?.file_path}
              alt="Gió xuân rực lửa"
              className="w-64 h-auto object-cover rounded-lg shadow-2xl relative"
            />
            {/* Book shadow */}
            <div className="absolute -bottom-2 left-2 right-2 h-4 bg-black/30 rounded-full blur-md"></div>
          </div>

          {/* Book title and author */}
          <h1 className="text-white text-2xl font-bold text-center">Gió xuân rực lửa</h1>
          <p className="text-white/80 text-center mb-1">
            <span className="text-sm">Tác giả: </span>
            <span className="text-orange-200 font-medium">
              {book?.authors?.map(author => (
                <span key={author.id}>
                  <Link to={`/author/${author.slug}`} className="hover:underline">
                    {author.name}
                  </Link>
                  {book.authors.indexOf(author) < book.authors.length - 1 ? ', ' : ''}
                </span>
              ))}
            </span>
          </p>

          {/* Ranking badge */}
          <div className=" rounded-full text-sm font-medium mb-2 items-center gap-2 lg:hidden block">
              <a
                href="/bang-xep-hang?rank_type=week&content_type=book_all"
                className="bg-pink-950 flex items-center max-w-fit p-2 rounded-full mt-2 mb-2"
              >
                <div className="w-12 h-7-5 bg-pink-500 rounded-full flex items-center justify-center mr-1">
                  <p className=" font-medium text-white-50">#49</p>
                </div>
                <p className="text-pink-500 mx-1-5">
                  trong Top xu hướng Sách điện tử
                </p>
                <img
                  src="https://waka.vn/svgs/icon-right-pink.svg"
                  alt="icon-right-pink"
                  className="cursor-pointer w-4 h-4"
                />
              </a>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 w-full max-w-sm mb-8 z-[7]">
            <button className="flex-1 bg-white/20 text-white border border-white/30 py-3 rounded-full font-medium hover:bg-white/30 transition-colors">
              NGHE THỬ
            </button>
            <button className="flex-1 bg-green-500 text-white py-3 rounded-full font-medium hover:bg-green-600 transition-colors">
              NÂNG CẤP
            </button>
          </div>
        </div>
        <div
          className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b to-[#121214] from-transparent pointer-events-none" />
      </div>
      <div className="w-full flex gap-12 lg:px-0 px-4">
        <div className="sticky top-[10%] w-[400px] z-[50] h-full mr-15 lg:block hidden">
          <div className="relative w-full">
            <div className=" relative rounded-xl overflow-hidden mb-10">
              <img alt={book?.title}
                loading="lazy"
                src={URL_IMG + book?.file_path} className="relative top-0 left-0 w-full h-full object-cover" />
            </div>
            <div className="book-border w-full top-0 left-0 absolute h-full">
            </div>
            {/* <div className="type-sale top-0 right-0 absolute w-30 h-7 pl-3">
              <p className="font-medium font-medium text-white-default uppercase py-1">
              Hội viên
              </p> <img src="https://waka.vn/svgs/icon-sale.svg" alt="icon-sale" className="cursor-pointer absolute top-0 right-0" />
            </div> */}
          </div>
        </div>
        <div className="lg:w-[54%] w-full z-[8] between-content mr-15">

          <div className="pb-4 border-b border-white-overlay">
            <div className="">
              <h1 className="lg:text-3xl font-bold text-xl lg:block hidden">{book?.title}</h1>
              <div className="flex mt-4">
                <div className="flex items-center mr-6">
                  <span className="text-white-50 block mr-1">4.2</span>
                  <div className="flex items-center justify-center">
                    <img
                      src="https://waka.vn/svgs/icon-star.svg"
                      alt="icon-star"
                      className="cursor-pointer w-4 h-6"
                    />
                    <img
                      src="https://waka.vn/svgs/icon-star.svg"
                      alt="icon-star"
                      className="cursor-pointer w-4 h-6"
                    />
                    <img
                      src="https://waka.vn/svgs/icon-star.svg"
                      alt="icon-star"
                      className="cursor-pointer w-4 h-6"
                    />
                    <img
                      src="https://waka.vn/svgs/icon-star.svg"
                      alt="icon-star"
                      className="cursor-pointer w-4 h-6"
                    />
                    <img
                      src="https://waka.vn/svgs/icon-star-empty.svg"
                      alt="icon-star-empty"
                      className="cursor-pointer w-4 h-6"
                    />
                  </div>
                </div>
                <p className="text-white-50">
                  <span className="text-gray-400">・</span>{totalComments} đánh giá
                </p>
              </div>
            </div>

            <div className="hidden lg:block">
              <a
                href="/bang-xep-hang?rank_type=week&content_type=book_all"
                className="bg-pink-950 flex items-center max-w-fit p-2 rounded-full mt-4 mb-2"
              >
                <div className="w-12 h-7-5 bg-pink-500 rounded-full flex items-center justify-center mr-1">
                  <p className="text-14-14 font-medium text-white-50">#49</p>
                </div>
                <p className="text-pink-500 mx-1-5 text-14-14">
                  trong Top xu hướng Sách điện tử
                </p>
                <img
                  src="https://waka.vn/svgs/icon-right-pink.svg"
                  alt="icon-right-pink"
                  className="cursor-pointer w-4 h-4"
                />
              </a>
            </div>
            <div className="mt-4 grid z-30 relative cus-grid gap-2 sm:grid-cols-2 xl:grid-cols-4 ">
              <div className="col-span-1 cus-col-span lg:block hidden">
                <p className="text-gray-400 font-medium">Tác giả</p>
                {book?.authors.length > 1 ? (
                  <Dropdown menu={{ items: itemAuthors }} placement="bottom" trigger={['click']}>
                    <span className="flex items-center cursor-pointer text-white-50 font-medium mt-[10px] sm:mt-[5px] xl:mt-[10px]">
                      {book?.authors[0]?.name}
                      <svg
                        className="ml-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill="currentColor"
                          d="M10.103 12.778L16.81 6.08a.69.69 0 0 1 .99.012a.726.726 0 0 1-.012 1.012l-7.203 7.193a.69.69 0 0 1-.985-.006L2.205 6.72a.727.727 0 0 1 0-1.01a.69.69 0 0 1 .99 0l6.908 7.068Z"
                        />
                      </svg>
                    </span>
                  </Dropdown>
                ) : (
                  <p className="text-white-50 font-medium mt-[10px] sm:mt-[5px] xl:mt-[10px]">
                    {book?.authors[0]?.name || ""}
                  </p>
                )}
              </div>
              <div className="col-span-1 cus-col-span">
                <p className="text-gray-400 font-medium">Thể loại</p>
                <div className="el-select text-white-50 font-medium custom-dropdown mt-1 sm:mt-0 xl:mt-1">
                  {book?.categories.length > 1 ? (
                    <Dropdown menu={{ items: itemCategory }} placement="bottom" trigger={['click']}>
                      <span className="flex items-center cursor-pointer text-white-50 font-medium mt-[10px] sm:mt-[5px] xl:mt-[10px]">
                        {book?.categories[0]?.name}
                        <svg
                          className="ml-2"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fill="currentColor"
                            d="M10.103 12.778L16.81 6.08a.69.69 0 0 1 .99.012a.726.726 0 0 1-.012 1.012l-7.203 7.193a.69.69 0 0 1-.985-.006L2.205 6.72a.727.727 0 0 1 0-1.01a.69.69 0 0 1 .99 0l6.908 7.068Z"
                          />
                        </svg>
                      </span>
                    </Dropdown>
                  ) : (
                    <p className="text-white-50 font-medium mt-[10px] sm:mt-[5px] xl:mt-[10px]">
                      {book?.categories[0]?.name || ""}
                    </p>
                  )}
                </div>
              </div>
              <div className="col-span-1 cus-col-span">
                <p className="text-gray-400 font-medium mb-[11px]">Nhà xuất bản</p>
                <p className="text-white-50 font-medium">NXB Lao Động</p>
              </div>
              <div className="col-span-1 cus-col-span sm:ml-0">
                <p className="text-gray-400 font-medium mb-[11px]">Gói cước</p>
                <p className="text-white-50 font-medium">Mua lẻ</p>
              </div>
            </div>
          </div>
          <div className="mt-7-5 mt-4">
            <div className="flex items-center">
              <div className="flex items-center cursor-pointer">
                <span className="text-white-400 text-16-16 mb-1 hidden lg:block">Chọn loại sách</span>
              </div>{" "}
              <div className="lg:px-3 w-full flex items-center cursor-pointer justify-center">
                <div className="flex lg:gap-4 gap-2 w-full">
                  <button className="flex-1 bg-white/10 border border-white/30 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-white/20 transition-colors">
                    <div className="text-left">
                      <div className="text-sm font-medium">Sách điện tử</div>
                      <div className="text-xs text-white/60">Hội viên</div>
                    </div>
                  </button>
                  <button className="flex-1 bg-green-500/80 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-500 transition-colors border-2 border-green-400">
                    <div className="text-left">
                      <div className="text-sm font-medium">Sách nói</div>
                      <div className="text-xs text-green-100">Hội viên</div>
                    </div>
                  </button>
                </div>
                {/**/}
              </div>
            </div>{" "}
            <div className="flex items-center relative z-30">
              <Link
                to={`/reader/${book?.slug}`}
                className="flex items-center justify-center my-4 py-3 rounded-full cursor-pointer text-white-default text-16-16 whitespace-nowrap w-[233px] px-4 button-col bg-maika-500"
              >
                <img
                  src="https://waka.vn/svgs/icon-book-blank.svg"
                  alt="icon-book-blank"
                  className="cursor-pointer mr-2"
                  data-v-5b161707=""
                />
                <span data-v-5b161707="">Đọc sách</span>
              </Link>
              <div className="w-12 ml-3 p-3 bg-white-overlay rounded-full border-white-overlay style-next-back">
                <img
                  src="https://waka.vn/svgs/icon-heart.svg"
                  alt="icon-heart"
                  className="cursor-pointer"
                />{" "}
                <img
                  src="https://waka.vn/svgs/liked_heart.svg"
                  alt="liked_heart"
                  className="cursor-pointer"
                  style={{ display: "none" }}
                />
              </div>{" "}
              <div className="p-3 btn-icon inline-block ml-3 style-next-back">
                <img
                  src="https://waka.vn/svgs/icon-share.svg"
                  alt="icon-share"
                  className="cursor-pointer"
                />
              </div>
            </div>
            <div className="my-15 mr-3 mt-4">
              <div className="relative">
                <div className="text-16 text-white-50 text-justify check-des">
                  <p style={{ textAlign: "justify" }} data-start={181} data-end={326}>
                    Bạn muốn hiểu rõ cách bộ não vận hành để huấn luyện hiệu quả hơn?
                  </p>
                  <p style={{ textAlign: "justify" }} data-start={181} data-end={326}>
                    Đây chính là cuốn sách dành cho bạn!
                  </p>
                  <p style={{ textAlign: "justify" }} data-start={181} data-end={326}>
                    Không còn những khái niệm khoa học khô khan, cuốn sách này biến những
                    nghiên cứu thần kinh học phức tạp thành công cụ huấn luyện dễ hiểu và
                    dễ áp dụng. Từ cách não ảnh hưởng đến
                    <span className="read-more cursor-pointer text-waka-500">
                      ... Xem thêm
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="text-white-default text-2xl-26-26 font-medium mb-4">
              Độc giả nói gì về “Huấn luyện não bộ (Chìa khóa thành công của những đào tạo
              chuyên nghiệp)”
            </div>
            <CommentSection
              comments={comments}
              onAddComment={handleAddComment}
              loading={commentsLoading}
              bookId={book?.id}
              hasMoreComments={hasMoreComments}
              onLoadMore={handleLoadMoreComments}
              totalComments={totalComments}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetail;