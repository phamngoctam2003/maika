import React, { useEffect, useState } from 'react';
import BookSlider from '@/components/user/sliderShow/book_slider';
import HomeService from '@/services/users/api-home';
import AudioBookService from '@/services/users/api-audiobook';
import { DynamicCategoryAudio } from '@/components/user/sach_noi/DynamicCategoryAudio';
// Lấy dữ liệu sách nói thật từ API
const SachNoi = () => {
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [books, setBooks] = useState([]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

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
        const fetchBooks = async () => {
            try {
                const res = await AudioBookService.getProposedBooks();
                console.log("Fetched audiobooks:", res);
                if (res) {
                    setBooks(res);
                } else {
                    setBooks([]);
                }
            } catch (error) {
                console.error("Error fetching audiobooks:", error);
                setBooks([]);
            }
        };
        fetchBooks();
    }, []);
    return (
        <>
            <BookSlider books={books} categoryOptions={categoryOptions} />
            <DynamicCategoryAudio />
        </>
    );
}

export default SachNoi;