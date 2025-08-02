import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/authcontext';
import { Helmet } from "react-helmet";
import SidebarProfile from '@components/user/sidebar/SidebarMenuProfile';
import { BookCardCategory } from "@/components/user/books/BookCard";
import BookGridSkeleton from "@/components/ui/BookSkeleton";
import BookCaseService from "@/services/users/api-bookcase";
const BookCase = () => {
    const { currentUser, activePackage, loading, setLoading, isAuthenticated } = useAuth();
    const [books, setBooks] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        if (loading) return;
        if (!isAuthenticated) {
            message.error('Bạn cần đăng nhập để truy cập trang này.');
            navigate('/');
        }
    }, [isAuthenticated, loading, navigate]);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const response = await BookCaseService.getBookCase();
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
    }, []);

    return (
        <>
            <Helmet>
                <title>Tủ sách của tôi | Maika</title>
                <meta name="description" content="Khám phá tủ sách cá nhân của bạn tại Maika" />
            </Helmet>
            <div className="min-h-screen bg-color-root pt-28 w-full px-4 lg:px-12">
                <div className="flex flex-col lg:flex-row min-h-screen">
                    <SidebarProfile formData={currentUser} activePackage={activePackage} />
                    <div className="flex-1 p-6 lg:p-8">
                        <h1 className="text-xl font-semibold mb-6">Tủ sách của tôi</h1>
                        <div className=" py-2">
                            {/* Books Grid */}
                            {loading ? (
                                <BookGridSkeleton count={16} />
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
                                        Tủ sách của bạn hiện tại trống
                                    </h3>
                                    <Link
                                        to="/ebook"
                                        className="inline-block bg-maika-500 hover:bg-maika-600 text-white px-6 py-3 rounded-lg transition-colors"
                                    >
                                        Khám phá sách
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BookCase;
