import HomeService from "@/services/users/api-home";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import BookGridSkeleton from "@/components/ui/BookSkeleton";
import { Link } from "react-router-dom";
import { BookCardCategory } from "@/components/user/books/bookcard";

const LazySearch = ({ keyword }) => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const response = await HomeService.getBookSearch({
                keyword: keyword
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
        fetchBooks();
    }, [keyword]);

    const pageTitle =  keyword ? `${keyword} | Maika` : 'Sách tại maika | Maika';
    return (
        <>
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={`Khám phá bộ sưu tập sách phong phú tại Maika`} />
            </Helmet>
            <div className="bg-[#121214] text-white py-2 lg:py-8 w-full px-4 lg:px-12 min-h-screen">
                <h2 className="text-lg md:text-1xl font-bold mb-2 lg:mb-6 text-white">
                    {
                        keyword ? `Từ khóa: ${keyword}` : 'Tất cả kết quả'
                    }
                </h2>
                <div className="py-2">
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
                        <div className="text-center flex flex-col mt-20 items-center justify-center h-64">
                            <div className="text-6xl mb-4">📚</div>
                            <h3 className="text-lg font-semibold mb-2">
                                Kết quả tìm kiếm không có sách nào phù hợp
                            </h3>
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
    )
}

export default LazySearch;