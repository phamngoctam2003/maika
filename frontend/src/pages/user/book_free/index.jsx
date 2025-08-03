import { useEffect, useState } from 'react';
import HomeService from '@/services/users/api-home';
import LazyBookFree from './lazy_book_free';
import { Select } from 'antd';
import bgBook from '/images/png/banner-major.png';
const BookFree = () => {
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [books, setBooks] = useState([]);
    const [format, setFormat] = useState('Sách điện tử');
    const [filterCategory, setFilterCategory] = useState('');
    const [categoryName, setCategoryName] = useState('');
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await HomeService.getCategories();
                if (res) {
                    const options = [
                        { value: '', label: 'Tất cả danh mục' },
                        ...res.data.map(category => ({
                            value: category.slug,
                            label: category.name,
                        })),
                    ]
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

    const handleFormatChange = (value) => {
        setFormat(value);
    };
    const handleFilterCategoryChange = (value, option) => {
        setFilterCategory(value);
        setCategoryName(option.label || '');
    };
    const formatOptions = [
        { value: 'Sách điện tử', label: 'Sách điện tử' },
        { value: 'Sách nói', label: 'Sách nói' },
    ];
    return (
        <>
            <div
                className="relative w-full text-white overflow-hidden select-none"
            >

                <div
                style={{
                    backgroundImage: `url(${bgBook})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }} className="flex lg:px-12 px-4 gap-4 h-[259px] w-full bg-major relative justify-end items-end pb-4">
                    {/* Left content */}
                    <div className="space-y-4 flex-1 min-w-0">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-10">
                            <h2 className="text-3xl md:text-4xl xl:text-5xl font-bold">
                                Sách miễn phí
                            </h2>
                            <div className="flex lg:w-auto w-full gap-4">
                                <Select
                                    className="custom-select"
                                    style={{ width: 300, height: 45 }}
                                    dropdownStyle={{ backgroundColor: '#1f2937' }}
                                    value={format}
                                    options={formatOptions}
                                    onChange={handleFormatChange}
                                />
                                <Select
                                    placeholder="Tất cả danh mục"
                                    className="custom-select"
                                    style={{ width: 300, height: 45 }}
                                    dropdownStyle={{ backgroundColor: '#1f2937' }}
                                    options={categoryOptions}
                                    onChange={handleFilterCategoryChange}
                                />
                            </div>
                        </div>


                        <h4 className='font-bold xl:text-xl text-lg lg:block hidden'>Khám phá thế giới sách Waka với hơn 3500+ Sách điện tử và Sách nói</h4>
                    </div>
                </div>
            </div>
            <LazyBookFree format={format} filterCategory={filterCategory} categoryName={categoryName} />
        </>
    );
}

export default BookFree;