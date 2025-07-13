import { useEffect, useState } from "react";
import HomeService from "@/services/users/api-home";
import { CategoryBooks } from "./category_books";

export const DynamicCategoryBooks = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await HomeService.getCategories();
                // Lọc lấy các danh mục phổ biến hoặc tất cả danh mục
                const popularCategories = response?.data || response || [];
                const categoriesWithSlug = popularCategories.map(category => {
                    let slug = category.slug;
                    const processedCategory = {
                        ...category,
                        slug: slug
                    };
                    return processedCategory;
                });
                
                // Có thể giới hạn số lượng danh mục hiển thị
                const limitedCategories = categoriesWithSlug.slice(0, 8);
                setCategories(limitedCategories);
            } catch (error) {
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);
    
    if (loading) {
        return (
            <div className="lg:px-12 px-4 mb-12">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-300 rounded w-64 mb-6"></div>
                    <div className="flex gap-4">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="flex-none w-[180px]">
                                <div className="h-64 bg-gray-300 rounded mb-2"></div>
                                <div className="h-4 bg-gray-300 rounded mb-1"></div>
                                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {categories.length > 0 ? (
                <>
                    {categories.map((category) => {
                        return (
                            <CategoryBooks 
                                key={category.id}
                                categorySlug={category.slug} 
                                categoryName={category.name}
                                limit={12}
                            />
                        );
                    })}
                </>
            ) : (
                <>
                    <div className="lg:px-12 px-4 mb-12">
                        <div className="text-center py-8">
                            <p className="text-gray-400 text-lg">
                                Không có danh mục nào để hiển thị.
                            </p>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};
