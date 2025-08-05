import { BookCardCategory } from "@/components/user/books/BookCard";
import { Link, useNavigate } from 'react-router-dom';
import BookGridSkeleton from "@/components/ui/BookSkeleton";
import { ListeningHistoryService } from "@/services/users/api-book-history";
import { useEffect, useState } from "react";

export default function RecentlyListened() {
    const [loading, setLoading] = useState(true);
    const [booksRecentlyListened, setBooksRecentlyListened] = useState([]);

    const fetchBooksRecentlyListened = async () => {
        try {
            setLoading(true);
            const response = await ListeningHistoryService.recentlyListened();
            console.log('Recently Listened Books:', response);
            const data = response?.data || response || {};
            setBooksRecentlyListened(data);
        } catch (error) {
            console.error('Error fetching recently listened books:', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchBooksRecentlyListened();
    }, []);
    return (
        <>
            {loading ? (
                <BookGridSkeleton count={16} />
            ) : booksRecentlyListened.length > 0 ? (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2 sm:gap-4 lg:gap-6">
                        {booksRecentlyListened.map((items) => (
                            <BookCardCategory
                                key={items.book.id}
                                book={items.book}
                                link={`/ebook/${items.book.slug}`}
                            />
                        ))}
                    </div>
                </>
            ) : (
                <div className="text-center py-16">
                    <div className="text-6xl mb-4">📚</div>
                    <h3 className="text-xl font-semibold mb-2">
                        Bạn chưa có sách nào đã nghe gần đây
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