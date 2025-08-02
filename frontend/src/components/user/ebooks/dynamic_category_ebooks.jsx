import { useEffect, useState } from "react";
import EbookService from "@/services/users/api-ebook";
import { LazyCategoryEbooks } from "./LazyCategoryEbooks";
import useInView from "@/hooks/useInView";
import useScrollInView from "@/hooks/useScrollInView";
import BookSliderSkeleton from "@/components/ui/BookSkeleton";

export const DynamicCategoryEbooks = ({
    initialPageSize = 1, // Số lượng danh mục load ban đầu
    loadMorePageSize = 8, // Số lượng load thêm mỗi lần scroll
    maxAttempts = 5, 
} = {}) => {
    const [categories, setCategories] = useState([]);
    const [currentLimit, setCurrentLimit] = useState(initialPageSize);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    // Load category đầu tiên
    const fetchInitialCategory = async () => {
        if (categories.length > 0) {
            return; // Đã load rồi thì không load lại
        }

        try {
            setLoading(true);
            const response = await EbookService.getEbookCategories(loadMorePageSize);
            const data = response?.data || response || {};
            // Kiểm tra format dữ liệu
            let initialCategories = [];
            if (Array.isArray(data)) {
                initialCategories = data;
            } else if (data.data && Array.isArray(data.data)) {
                initialCategories = data.data;
            }

            if (initialCategories && initialCategories.length > 0) {
                setCategories(initialCategories);
                setHasMore(data.has_more !== false);
                setCurrentLimit(2); // Page tiếp theo sẽ là 2
            } else {
                setHasMore(false);
            }
        } catch (error) {
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    // Load thêm categories khi scroll - với debug logging
    const loadMoreCategories = async () => {
        if (!hasMore) {
            return;
        }
        if (loading) {
            return;
        }
        // Safety check: nếu đã thử quá nhiều lần
        if (currentLimit > maxAttempts) {
            setHasMore(false);
            return;
        }
        try {
            setLoading(true);

            const response = await EbookService.getEbookCategories(currentLimit);
            const data = response?.data || response || {};
            // Xử lý dữ liệu trả về từ API
            let responseCategories = [];
            if (Array.isArray(data)) {
                responseCategories = data;
            } else if (data?.data && Array.isArray(data.data)) {
                responseCategories = data.data;
            }
            // Kiểm tra nếu API không trả về gì hoặc empty array
            if (!responseCategories || responseCategories.length === 0) {
                setHasMore(false);
                return;
            }
            // Chỉ thêm categories mới
            const newCategories = responseCategories.filter(
                newCat => !categories.some(existingCat => existingCat.id === newCat.id)
            );
            if (newCategories.length > 0) {
                setCategories(prev => {
                    const updated = [...prev, ...newCategories];
                    return updated;
                });
                setCurrentLimit(prev => {
                    const nextPage = prev + 1;
                    return nextPage;
                });
            } else {
                setHasMore(false);
                return;
            }
            // Kiểm tra API có báo hết data không
            if (data.has_more === false) {
                setHasMore(false);
            }
        } catch (error) {
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    // Hook để load category đầu tiên khi component mount
    const { elementRef: initialRef } = useInView(fetchInitialCategory);

    // Hook để load more khi scroll tới cuối
    const { elementRef: loadMoreRef } = useScrollInView(loadMoreCategories, {
        triggerOnce: false, // Có thể trigger nhiều lần
        threshold: 0.1
    });

    return (
        <div ref={initialRef}>
            {loading && categories.length === 0 && (
                <div className="pl-4 lg:pl-12 w-full">
                    <div className="animate-pulse pb-4 ">
                        <div className="h-8 bg-gray-300 rounded w-52 mb-4"></div>
                    </div>
                    <BookSliderSkeleton />
                </div>
            )}

            {categories.length > 0 ? (
                <>
                    {categories.map((category) => {
                        return (
                            <LazyCategoryEbooks
                                key={category.id}
                                categorySlug={category.slug}
                                categoryName={category.name}
                                limit={12}
                            />
                        );
                    })}

                    {/* Load more trigger - ẩn và tự động trigger khi scroll tới */}
                    {hasMore && (
                        <div
                            ref={loadMoreRef}
                            className="h-20 w-full flex items-center justify-center"
                            style={{ minHeight: '80px' }}
                        >
                        </div>
                    )}

                </>
            ) : (
                !loading && (
                    <div className="lg:px-12 px-4 mb-12">
                        <div className="text-center py-8">
                            <p className="text-gray-400 text-lg">
                                Không có danh mục nào để hiển thị.
                            </p>
                        </div>
                    </div>
                )
            )}
        </div>
    );
};
