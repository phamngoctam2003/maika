import UserBreadcrumb from "@components/user/breadcrumb";
import CommentSection from "@components/user/comments/CommentSection";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AntNotification } from "@components/global/notification";
import DetailtService from "@/services/users/api-detail";
import { Button, Dropdown } from "antd";
import { useAuth } from "@/contexts/authcontext";
import { useBook } from "@/contexts/book_context.jsx";

const SachNoiDetail = () => {
    const URL_IMG = import.meta.env.VITE_URL_IMG;
    const navigate = useNavigate();
    const { slug } = useParams();
    const [book, setBook] = useState(null);

    // Lấy thông tin user từ AuthContext để kiểm tra quyền truy cập
    const {
        currentUser,
        isAuthenticated,
        hasMembership,
        getMembershipInfo,
        isMembershipExpiringSoon,
        activePackage
    } = useAuth();
    const { openAudioModal, setOpenAudioModal, isAudioPlaying, setIsAudioPlaying, setCurrentBook } = useBook();

    const [currentPage, setCurrentPage] = useState(1);
    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [hasMoreComments, setHasMoreComments] = useState(true);
    const [totalComments, setTotalComments] = useState(0);

    const [currentFormat, setCurrentFormat] = useState('Sách nói');

    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: `${book?.title || ""}`, path: null },
    ];

    // Auto scroll to top when component mounts or slug changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [slug]);

    // Xác định format hiện tại dựa vào URL
    useEffect(() => {
        const pathname = window.location.pathname;
        if (pathname.includes('/ebook/')) {
            setCurrentFormat('Sách điện tử');
        } else if (pathname.includes('/sach-noi/')) {
            setCurrentFormat('Sách nói');
        }
    }, [slug]);

    /**
     * Kiểm tra xem người dùng có quyền đọc sách hội viên hay không
     * @returns {boolean} 
     */
    const canReadMemberBook = () => {
        // Kiểm tra xem người dùng đã đăng nhập chưa
        if (!isAuthenticated || !currentUser) {
            return false;
        }

        // Sử dụng function hasMembership từ AuthContext
        const hasActiveMembership = hasMembership();
        return hasActiveMembership;
    };

    /**
     * Kiểm tra xem cuốn sách có yêu cầu hội viên hay không
     * @returns {boolean} 
     */
    const isBookRequireMembership = () => {
        // Chỉ có 2 loại: 'member' (sách hội viên) và 'free' (sách miễn phí)
        const accessType = book?.access_type?.toLowerCase();

        // Sách member yêu cầu hội viên, còn lại là free
        const requireMembership = accessType === 'member';

        return requireMembership;
    };

    const handleReadBook = async () => {
        const requireMembership = isBookRequireMembership();
        const canRead = canReadMemberBook();

        // Kiểm tra xem sách có yêu cầu hội viên không
        if (requireMembership) {
            // Nếu sách yêu cầu hội viên, kiểm tra quyền của user
            if (!canRead) {
                if (!isAuthenticated) {
                    AntNotification.showNotification(
                        "Chưa đăng nhập",
                        "Vui lòng đăng nhập để nghe sách hội viên",
                        "warning"
                    );
                    return;
                }

                AntNotification.showNotification(
                    "Yêu cầu hội viên",
                    "Sách này dành cho hội viên. Vui lòng nâng cấp tài khoản để nghe",
                    "warning"
                );
                navigate('/package-plan', { replace: true });
                return;
            }
        }

        if (currentFormat === 'Sách nói') {
            // Lấy thông tin chapters và audio khi user bấm nghe
            try {
                if (book?.id) {
                    // Set book hiện tại vào context để audio player có thể sử dụng
                    setCurrentBook(book);

                    // Gọi API để lấy chapters và audio - có thể implement sau
                    // const chapters = await DetailtService.getBookChapters(book.id);
                    // const firstChapterAudio = await DetailtService.getChapterAudio(book.id, chapters[0].id);

                    // Lưu chapters vào state nếu cần
                    // setBookChapters(chapters);
                    // setCurrentAudio(firstChapterAudio);
                }
            } catch (error) {
                AntNotification.showNotification(
                    "Lỗi tải audio",
                    "Không thể tải nội dung audio. Vui lòng thử lại",
                    "error"
                );
                return;
            }

            setOpenAudioModal(true);
            if (!isAudioPlaying) {
                // Nếu modal đã mở, toggle trạng thái audio
                setIsAudioPlaying(true);
            } else {
                setIsAudioPlaying(pre => !pre);
            }
        } else {
            navigate(`/reader/${book?.slug}`);
        }
    };
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
                console.error("Error fetching audiobook:", error);
            }
        };
        fecthData();
    }, [slug]);

    // Auto redirect nếu người dùng vào sai trang format
    useEffect(() => {
        if (!book?.formats) return;

        const formats = book.formats || [];
        const hasEbook = formats.some(format => format.name === 'Sách điện tử');
        const hasAudio = formats.some(format => format.name === 'Sách nói');

        // Nếu đang ở trang sách nói nhưng không có audio format
        if (currentFormat === 'Sách nói' && !hasAudio && hasEbook) {
            navigate(`/ebook/${book.slug}`, { replace: true });
        }
    }, [book, currentFormat, navigate]);

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

    /**
     * Kiểm tra sách có hỗ trợ format nào không
     * @returns {object} - object chứa thông tin các format được hỗ trợ
     */
    const getSupportedFormats = () => {
        const formats = book?.formats || [];
        return {
            hasEbook: formats.some(format => format.name === 'Sách điện tử'),
            hasAudio: formats.some(format => format.name === 'Sách nói'),
            formats: formats
        };
    };

    /**
     * Xử lý chuyển đổi format sách
     * @param {string} formatType - 'Sách điện tử' hoặc 'Sách nói'
     */
    const { hasEbook, hasAudio } = getSupportedFormats();
    const handleFormatChange = (formatType) => {
        if (formatType === currentFormat) return; // Đã ở format hiện tại

        const { hasEbook, hasAudio } = getSupportedFormats();
        // Kiểm tra format có được hỗ trợ không
        if (formatType === 'Sách điện tử' && !hasEbook) {
            AntNotification.showNotification(
                "Không hỗ trợ",
                "Sách này không hỗ trợ định dạng điện tử",
                "warning"
            );
            return;
        }

        if (formatType === 'Sách nói' && !hasAudio) {
            AntNotification.showNotification(
                "Không hỗ trợ",
                "Sách này không hỗ trợ định dạng audio",
                "warning"
            );
            return;
        }

        // Chuyển đến trang tương ứng
        const newPath = formatType === 'Sách điện tử'
            ? `/ebook/${book?.slug}`
            : `/sach-noi/${book?.slug}`;

        navigate(newPath);
    };

    /**
     * Component hiển thị badge trạng thái sách (free/member)
     */
    const BookStatusBadge = () => {
        const accessType = book?.access_type?.toLowerCase();

        if (accessType === 'free') {
            return (
                <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-4 flex items-center gap-1">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    MIỄN PHÍ
                </div>
            );
        }

        if (accessType === 'member') {
            if (canReadMemberBook()) {
                // Lấy thông tin chi tiết về gói hội viên
                const membershipInfo = getMembershipInfo();
                const isExpiringSoon = isMembershipExpiringSoon();

                return (
                    <div className={`text-white px-3 py-1 rounded-full text-sm font-medium mb-4 flex items-center gap-1 ${isExpiringSoon ? 'bg-yellow-600' : 'bg-blue-600'
                        }`}>
                        <span className="w-2 h-2 bg-white rounded-full"></span>
                        {isExpiringSoon
                            ? `HỘI VIÊN - CÒN ${membershipInfo?.daysRemaining} NGÀY`
                            : 'HỘI VIÊN - CÓ QUYỀN TRUY CẬP'
                        }
                    </div>
                );
            }

            return (
                <div className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-4 flex items-center gap-1">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    YÊU CẦU HỘI VIÊN
                </div>
            );
        }

        // Default case (nếu access_type không phải 'free' hoặc 'member')
        return (
            <div className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-4 flex items-center gap-1">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                {accessType?.toUpperCase() || 'KHÔNG XÁC ĐỊNH'}
            </div>
        );
    };

    return (
        <div className="lg:px-12 w-full bg-color-detail">
            <UserBreadcrumb items={breadcrumbItems} />
            <div className="relative overflow-hidden block lg:hidden">
                {/* Background image - same as book cover but blurred */}
                <div className="absolute inset-0">
                    <img
                        src={URL_IMG + book?.file_path}
                        alt="Background"
                        loading="lazy"
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
                    {/* Member badge - hiển thị trạng thái sách */}
                    <BookStatusBadge />

                    {/* Book cover */}
                    <div className="relative mb-6">
                        <img
                            src={URL_IMG + book?.file_path}
                            className="w-64 h-auto object-cover rounded-lg shadow-2xl relative"
                            loading="lazy"
                        />
                        {/* Book shadow */}
                        <div className="absolute -bottom-2 left-2 right-2 h-4 bg-black/30 rounded-full blur-md"></div>
                    </div>

                    {/* Book title and author */}
                    <h1 className="text-white text-2xl font-bold text-center">{book?.title}</h1>
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
                                trong Top xu hướng Sách nói
                            </p>
                            <img
                                src="https://waka.vn/svgs/icon-right-pink.svg"
                                alt="icon-right-pink"
                                className="cursor-pointer w-4 h-4"
                            />
                        </a>
                    </div>

                    {/* Action buttons - Mobile version */}
                    <div className="flex gap-4 w-full max-w-sm mb-8 z-[4]">
                        <button className="flex-1 bg-white/20 text-white border border-white/30 py-3 rounded-full font-medium hover:bg-white/30 transition-colors">
                            NGHE THỬ
                        </button>
                        {/* Button nâng cấp - chỉ hiển thị khi cần hội viên và user chưa có quyền */}
                        <button
                            className={`flex-1 py-3 rounded-full font-medium transition-colors ${isBookRequireMembership() && !canReadMemberBook()
                                ? 'bg-orange-500 text-white hover:bg-orange-600' // Cần nâng cấp
                                : 'bg-green-500 text-white hover:bg-green-600'   // Có thể đọc hoặc sách miễn phí
                                }`}
                            onClick={() => {
                                if (isBookRequireMembership() && !canReadMemberBook()) {
                                    // Redirect đến trang nâng cấp
                                    navigate('/package-plan', { replace: true });
                                } else {
                                    // Có thể thực hiện action khác
                                    handleReadBook();
                                }
                            }}
                        >
                            {isBookRequireMembership() && !canReadMemberBook() ? "NÂNG CẤP" : "NGHE NGAY"}
                        </button>
                    </div>
                </div>
                <div
                    className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b to-[#121214] from-transparent pointer-events-none" />
            </div>
            <div className="w-full flex gap-12 lg:px-0 px-4">
                <div className="sticky top-[11%] w-[400px] z-[5] h-full mr-15 lg:block hidden">
                    <div className="relative w-full">
                        <div className=" relative rounded-xl overflow-hidden mb-10">
                            {
                                book?.file_path ?
                                    <img
                                        alt={book?.title}
                                        loading="lazy"
                                        src={URL_IMG + book?.file_path} className="relative top-0 left-0 w-full h-full object-cover" />
                                    :
                                        <div className="relative top-0 left-0 w-full h-full bg-gray-500" />
                            }

                        </div>
                        <div className="book-border w-full top-0 left-0 absolute h-full">
                        </div>
                    </div>
                </div>
                <div className="lg:w-[54%] w-full z-[8] between-content mr-15">

                    <div className="pb-4 border-b border-white-overlay">
                        <div className="">
                            <h1 className="lg:text-3xl font-bold text-xl lg:block hidden">{book?.title || ""}</h1>
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
                            <div className="mb-4">
                                <BookStatusBadge />
                            </div>

                            <a
                                href="/bang-xep-hang?rank_type=week&content_type=book_all"
                                className="bg-pink-950 flex items-center max-w-fit p-2 rounded-full mt-4 mb-2"
                            >
                                <div className="w-12 h-7-5 bg-pink-500 rounded-full flex items-center justify-center mr-1">
                                    <p className="text-14-14 font-medium text-white-50">#49</p>
                                </div>
                                <p className="text-pink-500 mx-1-5 text-14-14">
                                    trong Top xu hướng Sách nói
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
                                <span className="text-white-400 mb-1 hidden lg:block min-w-28">Chọn loại sách:</span>
                            </div>{" "}
                            <div className="lg:px-3 w-full flex items-center cursor-pointer justify-center">
                                <div className="flex lg:gap-4 gap-2 w-full">
                                    {(() => {
                                        const { hasEbook, hasAudio, formats } = getSupportedFormats();

                                        return (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        if (hasEbook) {
                                                            handleFormatChange('Sách điện tử');
                                                        }
                                                    }}
                                                    className={`flex-1 border py-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${currentFormat === 'Sách điện tử'
                                                        ? (book?.access_type?.toLowerCase() === 'member'
                                                            ? (canReadMemberBook()
                                                                ? 'bg-green-500/20 border-green-400 text-green-200' // Có quyền truy cập
                                                                : 'bg-orange-500/20 border-orange-400 text-orange-200') // Yêu cầu hội viên
                                                            : 'bg-green-500/20 border-green-400 text-green-200') // Sách miễn phí
                                                        : (hasEbook
                                                            ? 'bg-white/10 border-white/30 text-white hover:bg-white/20' // Có format và không active
                                                            : 'bg-gray-600/20 border-gray-500/30 text-gray-400 cursor-not-allowed') // Không có format
                                                        }`}
                                                >
                                                    <div className="text-left">
                                                        <div className="text-sm font-medium">Sách điện tử</div>
                                                        <div className="text-xs">
                                                            {!hasEbook
                                                                ? "Không có sẵn"
                                                                : (currentFormat === 'Sách điện tử'
                                                                    ? (book?.access_type?.toLowerCase() === 'member'
                                                                        ? (canReadMemberBook() ? "Có thể đọc" : "Yêu cầu hội viên")
                                                                        : "Miễn phí"
                                                                    )
                                                                    : "Chuyển sang ebook"
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                </button>

                                                {/* Button Sách nói - luôn hiển thị */}
                                                <button
                                                    onClick={() => {
                                                        if (hasAudio) {
                                                            handleFormatChange('Sách nói');
                                                        }
                                                    }}
                                                    className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors border-2 ${currentFormat === 'Sách nói'
                                                        ? (book?.access_type?.toLowerCase() === 'member'
                                                            ? (canReadMemberBook()
                                                                ? 'bg-green-500/80 border-green-400 text-white hover:bg-green-500' // Có quyền
                                                                : 'bg-orange-500/80 border-orange-400 text-white hover:bg-orange-500') // Yêu cầu hội viên
                                                            : 'bg-green-500/80 border-green-400 text-white hover:bg-green-500') // Miễn phí
                                                        : (hasAudio
                                                            ? 'bg-white/10 border-white/30 text-white hover:bg-white/20' // Có format và không active
                                                            : 'bg-gray-600/20 border-gray-500/30 text-gray-400 cursor-not-allowed') // Không có format
                                                        }`}
                                                >
                                                    <div className="text-left">
                                                        <div className="text-sm font-medium">Sách nói</div>
                                                        <div className="text-xs">
                                                            {!hasAudio
                                                                ? "Không có sẵn"
                                                                : (currentFormat === 'Sách nói'
                                                                    ? (book?.access_type?.toLowerCase() === 'member'
                                                                        ? (canReadMemberBook() ? "Có thể nghe" : "Yêu cầu hội viên")
                                                                        : "Miễn phí"
                                                                    )
                                                                    : "Chuyển sang sách nói"
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                </button>
                                            </>
                                        );
                                    })()}
                                </div>
                                {/**/}
                            </div>
                        </div>{" "}
                        <div className="flex items-center relative z-30">
                            <button
                                onClick={handleReadBook}
                                className="flex items-center justify-center my-4 py-2 rounded-full cursor-pointer text-white-default text-16-16 whitespace-nowrap w-[233px] px-4 button-col bg-maika-500 gap-1"
                            >
                                {isAudioPlaying && openAudioModal ?
                                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 16 16"><path fill="currentColor" fillRule="evenodd" d="M5 3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H5Zm5 0a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-1Z" clipRule="evenodd" /></svg>
                                    :
                                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 20 20"><path fill="currentColor" fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16a8 8 0 0 0 0 16ZM9.555 7.168A1 1 0 0 0 8 8v4a1 1 0 0 0 1.555.832l3-2a1 1 0 0 0 0-1.664l-3-2Z" clipRule="evenodd" /></svg>
                                }
                                <span data-v-5b161707="">
                                    {isBookRequireMembership() && !canReadMemberBook()
                                        ? (isAuthenticated ? "Nâng cấp để nghe sách" : "Đăng nhập để nghe sách")
                                        : (isAudioPlaying && openAudioModal ? "Tạm dừng" : "Nghe sách")
                                    }
                                </span>
                            </button>
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

                        {/* Thông báo về quyền truy cập sách */}
                        {isBookRequireMembership() && (
                            <div className="my-4 p-4 rounded-lg border border-orange-400/30 bg-orange-500/10">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center mt-0.5">
                                        <span className="text-white text-sm">✓</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-orange-200 font-medium mb-2">
                                            Sách dành cho hội viên
                                        </h4>
                                        {!isAuthenticated ? (
                                            <div className="text-orange-100 text-sm flex flex-wrap items-center">
                                                <span>Cuốn sách này dành cho hội viên.</span>
                                                <a href="#" className="text-orange-300 hover:underline mx-1">
                                                    Đăng nhập
                                                </a>
                                                <span>hoặc</span>
                                                <a href="#" className="text-orange-300 hover:underline mx-1">
                                                    đăng ký
                                                </a>
                                                <span>để tiếp tục.</span>
                                            </div>
                                        ) : !canReadMemberBook() ? (
                                            <div>
                                                <p className="text-orange-100 text-sm mb-3">
                                                    Bạn cần nâng cấp lên gói hội viên để nghe cuốn sách này.
                                                    Hội viên sẽ có quyền truy cập không giới hạn vào thư viện sách premium.
                                                </p>
                                                <button
                                                    onClick={() => navigate('/package-plan')}
                                                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                                >
                                                    Nâng cấp ngay
                                                </button>
                                            </div>
                                        ) : (
                                            <p className="text-green-200 text-sm">
                                                ✓ Bạn có thể nghe cuốn sách này với gói hội viên hiện tại.
                                                {(() => {
                                                    const membershipInfo = getMembershipInfo();
                                                    if (membershipInfo) {
                                                        return (
                                                            <span className="block mt-1 text-green-300">
                                                                Hội viên có hiệu lực đến: {new Date(membershipInfo.endsAt).toLocaleDateString('vi-VN')}
                                                            </span>
                                                        );
                                                    }
                                                    return null;
                                                })()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

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

export default SachNoiDetail;