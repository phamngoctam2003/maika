import { BookCardCategory } from "@/components/user/books/BookCard";
import { Link, useNavigate } from 'react-router-dom';
import BookCaseService from "@/services/users/api-bookcase";
import { useEffect, useState } from "react";
import BookGridSkeleton from "@/components/ui/BookSkeleton";
export default function Favourite() {
    const [loading, setLoading] = useState(true);
    const [booksFavourite, setBooksFavourite] = useState([]);
    const fetchBooks = async () => {
        try {
            setLoading(true);
            const response = await BookCaseService.getBookCase();
            const data = response?.data || response || {};
            setBooksFavourite(data);
        } catch (error) {
            console.error('Error fetching books free:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);
    return (
        <>
            {loading ? (
                <BookGridSkeleton count={16} />
            ) : booksFavourite.length > 0 ? (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2 sm:gap-4 lg:gap-6">
                        {booksFavourite.map((book) => (
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
                        Bạn chưa có sách yêu thích nào
                    </h3>
                    <Link
                        to="/ebook"
                        className="inline-block bg-maika-500 hover:bg-maika-600 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                        Khám phá sách
                    </Link>
                </div>
            )}
        </>
    );
}