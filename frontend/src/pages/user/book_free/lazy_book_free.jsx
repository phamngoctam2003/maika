import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { BookCardCategory } from "@/components/user/books/BookCard";
import { Pagination } from "antd";
import BookGridSkeleton from "@/components/ui/BookSkeleton";
import HomeService from "@/services/users/api-home";
import { Link } from "react-router-dom";


const LazyBookFree = ({ format, filterCategory, categoryName }) => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(24);
    const [sortorder, setSortorder] = useState('desc');
    const fetchBooksFree = async () => {
        try {
            setLoading(true);
            const response = await HomeService.getBookFree({
                page: currentPage,
                per_page: pageSize,
                sortorder: sortorder,
                format: format,
                filter_category: filterCategory,
            });
            const data = response?.data || response || {};
            setBooks(data);
        } catch (error) {
            console.error('Error fetching books free:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooksFree();
    }, [format, currentPage, pageSize, sortorder, filterCategory]);

    // Tạo fallback title khi categoryName chưa load
    const pageTitle =  categoryName ? `${categoryName} - Sách miễn phí | Maika` : 'Sách miễn phí | Maika';
    return (
        <>
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={`Khám phá bộ sưu tập sách ${categoryName} phong phú tại Maika`} />
            </Helmet>
            <div className="bg-[#121214] text-white py-2 lg:py-8 w-full px-4 lg:px-12">
                <h2 className="text-xl md:text-2xl font-bold mb-2 lg:mb-6 text-white">
                    {categoryName || 'Tất cả sách miễn phí'}
                </h2>
                <div className=" py-2">
                    {/* Books Grid */}
                    {loading ? (
                        <BookGridSkeleton count={24} />
                    ) : books.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2 sm:gap-4 lg:gap-6">
                                {books.map((book) => (
                                    <BookCardCategory
                                        key={book.id}
                                        book={book}
                                        link={`/ebook/${book.slug}`}
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-16">
                            <div className="text-6xl mb-4">📚</div>
                            <h3 className="text-xl font-semibold mb-2">
                                Không tìm thấy sách nào
                            </h3>
                            <p className="text-gray-400 mb-6">
                                Danh mục "{categoryName}" hiện chưa có sách miễn phí nào.
                            </p>
                            <Link
                                to="/ebook"
                                className="inline-block bg-maika-500 hover:bg-maika-600 text-white px-6 py-3 rounded-lg transition-colors"
                            >
                                Khám phá sách khác
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default LazyBookFree;
