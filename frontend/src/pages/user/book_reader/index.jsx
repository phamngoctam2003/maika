import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookSidebar from './book_sidebar';
import BookHeader from './book_header';
import BookContent from './book_content';
import BookProgress from './book_progress';
import BookControls from './book_controls';
import DetailtService from "@/services/users/api-detail";
import SidebarChapter from './sidebar_chapter';
import { trackBookView, saveReadingProgress, restoreReadingPosition } from '@/services/users/book-tracking';
import { useAuth } from '@/contexts/authcontext';
import { AntNotification } from "@components/global/notification";


const rawBookContent = [
  {
    id: 1,
    title: "Không có tiêu đề",
    content: `không có chương nào.`,
  },
];

const BookReader = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  // Lấy thông tin user từ AuthContext để kiểm tra quyền truy cập
  const { 
    currentUser, 
    isAuthenticated, 
    hasMembership, 
    getMembershipInfo 
  } = useAuth();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [brightness, setBrightness] = useState(100);
  const [isLoading, setIsLoading] = useState(true);
  const [book, setBook] = useState(null);
  const contentRef = useRef(null);
  const [bookContent, setBookContent] = useState([]);

  useEffect(() => {
    const fecthData = async () => {
      try {
        setIsLoading(true);
        const response = await DetailtService.getEbookReader(slug);
        setBook(response);
      } catch (error) {
        console.error("Error fetching book data:", error);
        
        // Xử lý lỗi quyền truy cập từ backend
        if (error?.response?.status === 401) {
          // Chưa đăng nhập
          AntNotification.showNotification(
            "Cần đăng nhập",
            error?.response?.data?.message || "Sách này dành cho hội viên. Vui lòng đăng nhập để tiếp tục.",
            "warning"
          );
          navigate('/login', { replace: true });
          return;
        } else if (error?.response?.status === 403) {
          // Không có quyền truy cập (thiếu hội viên)
          const errorData = error?.response?.data;
          AntNotification.showNotification(
            "Yêu cầu hội viên",
            errorData?.message || "Sách này dành cho hội viên. Vui lòng nâng cấp tài khoản để đọc.",
            "warning"
          );
          
          // Log thông tin chi tiết để debug
          console.log('BookReader - Access denied:', {
            book_slug: slug,
            error_code: errorData?.error_code,
            access_type: errorData?.access_type,
            user_membership: errorData?.user_membership
          });
          
          navigate(`/book-detail/${slug}`, { replace: true });
          return;
        } else if (error?.response?.status === 404) {
          // Sách không tồn tại
          AntNotification.showNotification(
            "Không tìm thấy",
            "Sách không tồn tại hoặc đã bị xóa.",
            "error"
          );
          navigate('/', { replace: true });
          return;
        }
        
        // Lỗi khác
        AntNotification.showNotification(
          "Lỗi hệ thống", 
          "Có lỗi xảy ra khi tải sách. Vui lòng thử lại sau.",
          "error"
        );
        console.error("Lỗi hệ thống:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fecthData();
  }, [slug]);

  useEffect(() => {
    // Sau này sẽ chuyển lại thành book.chapters khi API đã chuẩn
    const dataToProcess = book?.chapters && Array.isArray(book.chapters) && book.chapters.length > 0 
      ? book.chapters 
      : rawBookContent;

    const chapterElements = dataToProcess.map(chapter => {
      
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.visibility = 'hidden';
      tempDiv.style.width = '800px';
      tempDiv.style.fontSize = `${fontSize}px`;
      tempDiv.style.lineHeight = '3.6';
      tempDiv.style.whiteSpace = 'pre-wrap';
      tempDiv.style.wordBreak = 'break-word';
      document.body.appendChild(tempDiv);

      const content = chapter.content || '';
      
      // Chia content thành các đoạn, nếu không có \n thì chia theo từ
      let paragraphs = content.split(/\n+/).filter(p => p.trim().length > 0); // Lọc bỏ đoạn trống
      
      // Nếu chỉ có 1 đoạn nhưng quá dài, chia theo câu hoặc từ
      if (paragraphs.length === 1 && content.length > 1000) {
        // Thử chia theo dấu chấm câu trước
        const sentences = content.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 100); // Chỉ lấy câu có ít nhất 20 ký tự
        
        if (sentences.length > 1) {
          paragraphs = sentences;
        } else {
          // Nếu không có câu rõ ràng, chia theo từ (mỗi 100 từ để tránh trang quá ngắn)
          const words = content.split(/\s+/);
          paragraphs = [];
          for (let i = 0; i < words.length; i += 100) {
            const chunk = words.slice(i, i + 100).join(' ');
            if (chunk.trim().length > 50) { // Chỉ thêm chunk có ít nhất 50 ký tự
              paragraphs.push(chunk);
            }
          }
        }
      }
      
      const pages = [];
      let buffer = '';

      for (let i = 0; i < paragraphs.length; i++) {
        let testBuffer = buffer ? buffer + '\n' + paragraphs[i] : paragraphs[i];
        tempDiv.innerHTML = testBuffer; // Sử dụng innerHTML thay vì innerText để render HTML
        if (tempDiv.scrollHeight > 700 && buffer) {
          pages.push(buffer.trim());
          buffer = paragraphs[i];
        } else {
          buffer = testBuffer;
        }
        // Nếu là đoạn cuối cùng push luôn
        if (i === paragraphs.length - 1 && buffer) {
          tempDiv.innerHTML = buffer; // Sử dụng innerHTML
          pages.push(buffer.trim());
        }
      }

      document.body.removeChild(tempDiv);

      return {
        ...chapter,
        pages,
      };
    });

    setBookContent(chapterElements);
  }, [fontSize, book]);

  const handleChapterChange = (chapterIndex) => {
    setCurrentChapter(chapterIndex);
    setCurrentPage(0); // Reset về trang đầu của chương mới
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const getTotalPages = () => bookContent.reduce((t, ch) => t + ch.pages.length, 0);
  const getCurrentAbsolutePage = () => {
    let page = 0;
    for (let i = 0; i < currentChapter; i++) page += bookContent[i].pages.length;
    return page + currentPage + 1;
  };

  const goToAbsolutePage = (absolutePage) => {
    let target = Math.max(1, Math.min(absolutePage, getTotalPages()));
    let tempPage = 0;
    for (let i = 0; i < bookContent.length; i++) {
      const chapterPages = bookContent[i].pages.length;
      if (tempPage + chapterPages >= target) {
        setCurrentChapter(i);
        setCurrentPage(target - tempPage - 1);
        break;
      }
      tempPage += chapterPages;
    }
  };

  const handleProgressChange = (e) => {
    const percent = parseInt(e.target.value);
    const target = Math.round((percent / 100) * getTotalPages());
    goToAbsolutePage(target);
  };

  const nextPage = () => {
    if (currentPage < bookContent[currentChapter].pages.length - 1) setCurrentPage(currentPage + 1);
    else if (currentChapter < bookContent.length - 1) {
      setCurrentChapter(currentChapter + 1);
      setCurrentPage(0);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
    else if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1);
      setCurrentPage(bookContent[currentChapter - 1].pages.length - 1);
    }
  };

  const isFirstPage = () => currentChapter === 0 && currentPage === 0;
  const isLastPage = () => currentChapter === bookContent.length - 1 && currentPage === bookContent[currentChapter].pages.length - 1;

  // Track book view khi user đọc
  useEffect(() => {
    // Chỉ track khi đã có dữ liệu book và bookContent đầy đủ
    if (book?.slug && bookContent.length > 0 && getTotalPages() > 0) {
      // Debounce 2 giây để tránh spam khi user chuyển trang nhanh
      const timer = setTimeout(() => {
        trackBookView(book.slug, getTotalPages, getCurrentAbsolutePage);
        // Chỉ lưu progress, không lưu quá thường xuyên
        saveReadingProgress(book.slug, currentChapter, currentPage, bookContent);
      }, 2000); // Tăng từ 100ms lên 2000ms
      
      return () => clearTimeout(timer);
    }
  }, [currentPage, currentChapter, book?.slug, bookContent]); // Track mỗi khi chuyển trang hoặc chương

  // Khôi phục vị trí đọc khi load sách
  useEffect(() => {
    const restorePosition = async () => {
      if (book?.slug && bookContent.length > 0) {
        try {
          // Fix: Truyền đủ 2 parameters
          const position = await restoreReadingPosition(book.slug, bookContent);
          console.log('📚 Position nhận được:', position);
          
          // Fix: Sử dụng đúng property names và phục hồi cả chapter + page
          if (position && (position.chapterIndex !== currentChapter || position.pageIndex !== currentPage)) {
            console.log(`📚 Khôi phục từ chương ${currentChapter + 1} trang ${currentPage + 1} → chương ${position.chapterIndex + 1} trang ${position.pageIndex + 1}`);
            
            setCurrentChapter(position.chapterIndex);
            setCurrentPage(position.pageIndex);
          } else {
            console.log('📚 Vị trí hiện tại đã đúng hoặc không có lịch sử');
          }
        } catch (error) {
          console.error('📚 Lỗi khôi phục vị trí:', error);
        }
      }
    };
    
    restorePosition();
  }, [book?.slug, bookContent]); // Chỉ chạy khi book và content đã sẵn sàng

  /**
   * Kiểm tra xem người dùng có quyền đọc sách hội viên hay không
   * @returns {boolean} - true nếu có quyền, false nếu không có quyền
   */
  const canReadMemberBook = () => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    if (!isAuthenticated || !currentUser) {
      console.log('BookReader - canReadMemberBook: User not authenticated');
      return false;
    }

    // Sử dụng function hasMembership từ AuthContext
    // Function này đã kiểm tra gói có active và chưa hết hạn
    const hasActiveMembership = hasMembership();
    console.log('BookReader - canReadMemberBook:', {
      isAuthenticated,
      currentUser: !!currentUser,
      hasActiveMembership,
      slug
    });
    
    return hasActiveMembership;
  };

  /**
   * Kiểm tra xem cuốn sách có yêu cầu hội viên hay không
   * @returns {boolean} - true nếu sách yêu cầu hội viên, false nếu miễn phí
   */
  const isBookRequireMembership = () => {
    // Chỉ có 2 loại: 'member' (sách hội viên) và 'free' (sách miễn phí)
    const accessType = book?.access_type?.toLowerCase();
    
    // Sách member yêu cầu hội viên, còn lại là free
    const requireMembership = accessType === 'member';
    
    console.log('BookReader - isBookRequireMembership:', {
      book_id: book?.id,
      book_slug: book?.slug,
      access_type: accessType,
      requireMembership
    });
    
    return requireMembership;
  };

  /**
   * Kiểm tra quyền truy cập và chuyển hướng nếu không có quyền
   */
  const checkAccessPermission = () => {
    if (!book) return; // Chưa load được book data
    
    const requireMembership = isBookRequireMembership();
    const canRead = canReadMemberBook();
    
    console.log('BookReader - checkAccessPermission:', {
      book_slug: book?.slug,
      requireMembership,
      canRead,
      isAuthenticated
    });
    
    // Nếu sách yêu cầu hội viên nhưng user không có quyền
    if (requireMembership && !canRead) {
      // Nếu chưa đăng nhập
      if (!isAuthenticated) {
        AntNotification.showNotification(
          "Cần đăng nhập",
          "Sách này dành cho hội viên. Vui lòng đăng nhập để tiếp tục.",
          "warning"
        );
        // Chuyển về trang chi tiết sách
        navigate(`/ebook/${book?.slug}`, { replace: true });
        return;
      }
      
      // Nếu đã đăng nhập nhưng không có hội viên hoặc hết hạn
      AntNotification.showNotification(
        "Yêu cầu hội viên",
        "Sách này dành cho hội viên. Vui lòng nâng cấp tài khoản để đọc.",
        "warning"
      );
      // Chuyển về trang chi tiết sách
      navigate(`/package-plan`, { replace: true });
      return;
    }
    
    console.log('BookReader - Access granted for book:', book?.slug);
  };

  // Effect để kiểm tra quyền truy cập khi book data đã load
  useEffect(() => {
    if (book && !isLoading) {
      checkAccessPermission();
    }
  }, [book, isLoading, isAuthenticated, currentUser]);

  // Loading screen
  if (isLoading || !book || bookContent.length === 0) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
        <div className="spinner">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex w-full h-screen bg-gray-900 text-white z-50">
      <SidebarChapter 
        sidebarOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
        books={book} 
        currentChapter={currentChapter}
        onChapterChange={handleChapterChange}
      />
        <BookSidebar chapters={book} />

      <div className="flex-1 flex flex-col">
        <BookHeader toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} chapters={book} />
        <div className="flex-1 flex overflow-y-auto relative" ref={contentRef}>
          <BookContent
            chapter={bookContent[currentChapter]}
            page={currentPage}
            fontSize={fontSize}
            brightness={brightness}
          />
          <div className="lg:px-6 my-2 flex justify-between absolute bottom-0 left-0 right-0">
            <button onClick={prevPage} disabled={isFirstPage()} className="p-3 hover:bg-gray-700 rounded-lg disabled:opacity-50">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 15 15"><path fill="currentColor" fillRule="evenodd" d="M8.842 3.135a.5.5 0 0 1 .023.707L5.435 7.5l3.43 3.658a.5.5 0 0 1-.73.684l-3.75-4a.5.5 0 0 1 0-.684l3.75-4a.5.5 0 0 1 .707-.023Z" clipRule="evenodd" /></svg>
            </button>
            <button onClick={nextPage} disabled={isLastPage()} className="p-3 hover:bg-gray-700 rounded-lg disabled:opacity-50">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 15 15"><path fill="currentColor" fillRule="evenodd" d="M6.158 3.135a.5.5 0 0 1 .707.023l3.75 4a.5.5 0 0 1 0 .684l-3.75 4a.5.5 0 1 1-.73-.684L9.566 7.5l-3.43-3.658a.5.5 0 0 1 .023-.707Z" clipRule="evenodd" /></svg>
            </button>
          </div>
        </div>
        <BookProgress
          currentChapterData={bookContent[currentChapter]}
          getCurrentAbsolutePage={getCurrentAbsolutePage}
          getTotalPages={getTotalPages}
          handleProgressChange={handleProgressChange}
        />
        <BookControls
          fontSize={fontSize}
          setFontSize={setFontSize}
          brightness={brightness}
          setBrightness={setBrightness}
        />
      </div>
      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-[10]" onClick={toggleSidebar} />}
    </div>
  );
};

export default BookReader;
