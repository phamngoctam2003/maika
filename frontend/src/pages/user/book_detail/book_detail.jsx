import UserBreadcrumb from "@components/user/breadcrumb";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DetailtService from "@/services/users/api-detail";
import { Button, Dropdown } from "antd";
const BookDetail = () => {
  const URL_IMG = import.meta.env.VITE_URL_IMG;
  const navigate = useNavigate();
  const { slug } = useParams();
  const [book, setBook] = useState(null);
  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: `${book?.title}`, path: null },
  ];

  useEffect(() => {
    const fecthData = async () => {
      try {
        const response = await DetailtService.getEbook(slug);
        setBook(response);
      } catch (error) {
        console.error("Error fetching latest products:", error);
      }
    };
    fecthData();
  }, [slug]);

  const itemAuthors = book?.authors?.map(element => ({
    key: element?.id,
    label: <Link to={`/author/${element.slug}`}>{element?.name}</Link>,
  })) || [];

  const itemCategory = book?.categores?.map(element => ({
    key: element?.id,
    label: <Link to={`/author/${element.slug}`}>{element?.name}</Link>,
  })) || [];

  return (
    <div className="px-12 w-full bg-color-detail">
      <UserBreadcrumb items={breadcrumbItems} />
      <div className="w-full flex gap-12">
        <div className="sticky top-[10%] w-[400px] z-[50] h-full mr-15">
          <div className="relative w-full">
            <div className=" relative rounded-xl overflow-hidden mb-10">
              <img alt={book?.title}
                loading="lazy"
                src={URL_IMG + book?.file_path} className="relative top-0 left-0 w-full h-full object-cover" />
            </div>
            <div className="book-border w-full top-0 left-0 absolute h-full">
            </div>
            <div className="type-sale top-0 right-0 absolute w-30 h-7 pl-3">
              {/* <p className="font-medium font-medium text-white-default uppercase py-1"> */}
              {/* Hội viên */}
              {/* </p> <img src="https://waka.vn/svgs/icon-sale.svg" alt="icon-sale" className="cursor-pointer absolute top-0 right-0" /> */}
            </div>
          </div>
        </div>
        <div className="w-[54%] z-[8] between-content mr-15">
          <div className="pb-4 border-b border-white-overlay">
            <h1 className="text-3xl font-bold">{book?.title}</h1>
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
                <span className="text-gray-400">・</span>5 đánh giá
              </p>
            </div>
            <div>
              <a
                href="/bang-xep-hang?rank_type=week&content_type=book_all"
                className="bg-pink-950 flex items-center max-w-fit p-2 rounded-full mt-4 mb-2"
              >
                <div className="w-12 h-7-5 bg-pink-500 rounded-full flex items-center justify-center">
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
              <div className="col-span-1 cus-col-span ">
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
              <div className="pr-3 flex items-center cursor-pointer">
                <span className="text-white-400 text-16-16 mb-1">Chọn loại sách</span>
              </div>{" "}
              <div className="px-3 flex items-center cursor-pointer mr-3 justify-center">
                <div className="relative w-[310px] h-[36px] text-white-400 text-16-16 bg-bt-cate-book rounded-lg flex items-center justify-center z-30">
                  <div className="category-book-active w-[234px] h-[32px] cursor-pointer rounded-lg inline-flex items-center justify-center text-center">
                    <span className="text-14-14 inline-flex items-center justify-center text-center">
                      Sách điện tử
                    </span>
                  </div>{" "}
                  <div className="w-[234px] h-[32px] cursor-pointer rounded-lg inline-flex items-center justify-center text-center">
                    <span className="text-14-14 inline-flex items-center justify-center text-center">
                      Sách nói
                    </span>
                  </div>{" "}
                  <div className="w-[234px] h-[32px] cursor-pointer rounded-lg inline-flex items-center justify-center text-center">
                    <span className="text-14-14 inline-flex items-center justify-center text-center">
                      Sách giấy
                    </span>
                  </div>{" "}
                  {/**/}
                </div>
              </div>
            </div>{" "}
            <div className="flex items-center">
              <div className="pr-3 flex items-center cursor-pointer">
                <span className="text-white-400 text-16-16 mb-1">Chọn nội dung</span>
              </div>{" "}
              <div className="px-3 flex items-center cursor-pointer mr-3 justify-center">
                <div className="w-[236px] h-[36px] text-white-400 text-16-16 bg-bt-cate-book rounded-lg flex items-center justify-center z-30">
                  <div className="w-[234px] h-[32px] cursor-pointer rounded-lg inline-flex items-center justify-center text-center brief-active">
                    <span className="text-14-14 inline-flex items-center justify-center text-center">
                      Đầy đủ
                    </span>
                  </div>{" "}
                  <div className="w-[234px] h-[32px] cursor-pointer rounded-lg inline-flex items-center justify-center text-center brief-active-not">
                    <span className="text-14-14 inline-flex items-center justify-center text-center">
                      Tóm tắt
                    </span>
                  </div>
                </div>{" "}
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
            <div>
              <div>
                <div className="flex gap-6 py-3 tabs border-white-overlay pb-4 border-b border-white-overlay">
                  <div className="cursor-pointer flex items-center">
                    <p className="font-medium text-[19px] text-waka-500 ">
                      Bình luận (0)
                    </p>
                  </div>
                  <div className="cursor-pointer flex items-center">
                    <p className="leading-5 font-normal text-white-300 ">
                      Đánh giá &amp; nhận xét (1)
                    </p>
                  </div>
                </div>
                <div className="mt-5">
                  <div>
                    <div className="flex items-center justify-center flex-col">
                      <img
                        src="/images/png/comment-empty.png"
                        alt="maika"
                        className="cursor-pointer"
                      />
                      <p className="text-16-16 text-white-400">Chưa có bình luận nào</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

export default BookDetail;