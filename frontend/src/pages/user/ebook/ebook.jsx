import React, { useEffect, useState } from 'react';
import BookSlider from '@/components/user/sliderShow/book_slider';
import { DynamicCategoryEbooks } from '@/components/user/ebooks/dynamic_category_ebooks';
import HomeService from '@/services/users/api-home';
import EbookService from '@/services/users/api-ebook';

const Ebook = () => {
    const [categoryOptions, setCategoryOptions] = useState([]);
        const [books, setBooks] = useState([]);
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

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await EbookService.getProposedBooks();
                if (res) {
                    setBooks(res);
                } else {
                    setBooks([]);
                }
            } catch (error) {
                setBooks([]);
            }
        };
        fetchBooks();
    }, []);

    return (
        <>
            <BookSlider books={books} categoryOptions={categoryOptions} />
            <DynamicCategoryEbooks />
        </>
    );
}

export default Ebook;