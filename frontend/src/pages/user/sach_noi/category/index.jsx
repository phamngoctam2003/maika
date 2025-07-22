import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import AudioBookService from "@/services/users/api-audiobook";
import BookCard from "@/components/user/books/BookCard";
import { Pagination } from "antd";
import BookGridSkeleton from "@/components/ui/BookSkeleton";
import HomeService from "@/services/users/api-home";
import BookSlider from "@/components/user/book_slider";


const AudioCategory = () => {
    const { slug } = useParams();
    const [books, setBooks] = useState([]);
    const [categoryInfo, setCategoryInfo] = useState(null);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 24,
        total: 0,
    });

    const fetchBooksByCategory = async (page = 1) => {
        try {
            setLoading(true);
            const response = await AudioBookService.getAudioByCategoryPaginated(slug, page, pagination.limit);
            const data = response?.data || response || {};

            if (data) {
                setBooks(data);
                setPagination({
                    page: data.page || page,
                    limit: data.limit || pagination.limit,
                    total: data.total || 0,
                });

                // Set category info từ first book nếu có
                if (data.length > 0 && data[0].categories?.length > 0) {
                    const category = data[0].categories.find(cat => cat.slug === slug);
                    setCategoryInfo(category);
                }
            }
        } catch (error) {
            console.error('Error fetching books by category:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await HomeService.getAudiobookCategories();
                if (res) {
                    const options = res.data.map((category) => ({
                        value: category.id,
                        label: category.name,
                        link: `/sach-noi/category/${category.slug}`,
                    }));
                    setCategoryOptions(options);
                    // setCategoryId(options[0]?.value || '');
                } else {
                    console.error("No categories found in response");
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (slug) {
            fetchBooksByCategory(1);
        }
    }, [slug]);

    const handlePageChange = (newPage) => {
        fetchBooksByCategory(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Tạo fallback title khi categoryName chưa load
    const categoryName = categoryInfo?.name || 'Danh mục sách';
    const pageTitle = `${categoryName} - Sách nói | Maika`;

    return (
        <>
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={`Khám phá bộ sưu tập sách nói ${categoryName} phong phú tại Maika`} />
            </Helmet>
            <BookSlider books={books} categoryId={categoryInfo?.id} categoryOptions={categoryOptions} />

            <div className="bg-[#121214] text-white py-2 lg:py-8 w-full px-4 lg:px-12">
                <h2 className="text-xl md:text-2xl font-bold mb-2 lg:mb-6 text-white">
                    Tất cả các sách
                </h2>
                <div className=" py-2">
                    {/* Books Grid */}
                    {loading ? (
                        <BookGridSkeleton count={24} />
                    ) : books.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2 sm:gap-4 lg:gap-6">
                                {books.map((book) => (
                                    <BookCard
                                        key={book.id}
                                        book={book}
                                        link={`/sach-noi/${book.slug}`}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            {pagination.total > pagination.limit && (
                                <div className="flex justify-center mt-8">
                                    <Pagination
                                        current={pagination.page}
                                        total={pagination.total}
                                        pageSize={pagination.limit}
                                        onChange={handlePageChange}
                                        showSizeChanger={false}
                                        showQuickJumper
                                        showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} sách`}
                                        className="text-white"
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-16">
                            <div className="text-6xl mb-4">📚</div>
                            <h3 className="text-xl font-semibold mb-2">
                                Không tìm thấy sách nào
                            </h3>
                            <p className="text-gray-400 mb-6">
                                Danh mục "{categoryName}" hiện chưa có sách nói nào.
                            </p>
                            <a
                                href="/ebook"
                                className="inline-block bg-maika-500 hover:bg-maika-600 text-white px-6 py-3 rounded-lg transition-colors"
                            >
                                Khám phá sách khác
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AudioCategory;
