import React, { useEffect, useState } from 'react';
import BookSlider from '@/components/user/book_slider';
import { DynamicCategoryEbooks } from '@/components/user/ebooks/dynamic_category_ebooks';
import HomeService from '@/services/users/api-home';
const books = [
    {
        id: 1,
        title: "Tôi ổn – Bạn ổn",
        author: "Thomas A. Harris",
        file_path: "/images/image1.png",
        description:
            "Gỡ bỏ gánh nặng “Tôi không ổn” từ tuổi thơ để sống hạnh phúc. Cuốn sách tâm lý học kinh điển giúp hàng triệu người chưa bao giờ thấy mình ổn trở nên ổn hơn...",
    },
    {
        id: 2,
        title: "1, 2, 3... yêu rồi!",
        author: "Phan Thị Hồ Điệp",
        file_path: "/images/image2.png",
        description:
            "Những câu chuyện nhẹ nhàng trong đời sống thường nhật truyền cảm hứng tích cực Những câu chuyện nhẹ nhàng trong đời sống thường nhật truyền cảm hứng tích cực Những câu chuyện nhẹ nhàng trong đời sống thường nhật truyền cảm hứng tích cực Những câu chuyện nhẹ nhàng trong đời sống thường nhật truyền cảm hứng tích cực Những câu chuyện nhẹ nhàng trong đời sống thường nhật truyền cảm hứng tích cực Những câu chuyện nhẹ nhàng trong đời sống thường nhật truyền cảm hứng tích cựcNhững câu chuyện nhẹ nhàng trong đời sống thường nhật truyền cảm hứng tích cực Những câu chuyện nhẹ nhàng trong đời sống thường nhật truyền cảm hứng tích cực Những câu chuyện nhẹ nhàng trong đời sống thường nhật truyền cảm hứng tích cực Những câu chuyện nhẹ nhàng trong đời sống thường nhật truyền cảm hứng tích cực.",
    },
    {
        id: 3,
        title: "Nhiều kiếp nhân sinh",
        author: "Nguyên Phong",
        file_path: "/images/image3.png",
        description:
            "Một hành trình tâm linh sâu sắc giúp người đọc hiểu về nghiệp, luân hồi và giác ngộ.",
    },
    {
        id: 4,
        title: "Nhiều kiếp nhân sinh",
        author: "Nguyên Phong",
        file_path: "/images/image1.png",
        description:
            "Một hành trình tâm linh sâu sắc giúp người đọc hiểu về nghiệp, luân hồi và giác ngộ.",
    },
    {
        id: 5,
        title: "Nhiều kiếp nhân sinh",
        author: "Nguyên Phong",
        file_path: "/images/image3.png",
        description:
            "Một hành trình tâm linh sâu sắc giúp người đọc hiểu về nghiệp, luân hồi và giác ngộ.",
    },
];

const Ebook = () => {
    const [categoryOptions, setCategoryOptions] = useState([]);
    useEffect(() => {
    const fetchCategories = async () => {
        try {
            const res = await HomeService.getEbookCategories();
            if (res) {
                const options = res.data.map((category) => ({
                    value: category.id,
                    label: category.name,
                    link: `/ebook/category/${category.slug}`,
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

    return (
        <>
            <BookSlider books={books} categoryOptions={categoryOptions} />
            <DynamicCategoryEbooks />
        </>
    );
}

export default Ebook;