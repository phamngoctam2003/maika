import { CategoryBooks } from "./category_books";

// Component cho sách trinh thám
export const DetectiveBooks = () => {
    return (
        <CategoryBooks 
            categorySlug="trinh-tham" 
            categoryName="Sách Trinh Thám"
            limit={12}
        />
    );
};

// Component cho sách kinh doanh
export const BusinessBooks = () => {
    return (
        <CategoryBooks 
            categorySlug="kinh-doanh" 
            categoryName="Sách Kinh Doanh"
            limit={12}
        />
    );
};

// Component cho sách tiểu thuyết
export const NovelBooks = () => {
    return (
        <CategoryBooks 
            categorySlug="tieu-thuyet" 
            categoryName="Tiểu Thuyết"
            limit={12}
        />
    );
};

// Component cho sách khoa học viễn tưởng
export const SciFiBooks = () => {
    return (
        <CategoryBooks 
            categorySlug="khoa-hoc-vien-tuong" 
            categoryName="Khoa Học Viễn Tưởng"
            limit={12}
        />
    );
};

// Component cho sách kỹ năng sống
export const LifeSkillBooks = () => {
    return (
        <CategoryBooks 
            categorySlug="ky-nang-song" 
            categoryName="Kỹ Năng Sống"
            limit={12}
        />
    );
};

// Component cho sách tâm lý học
export const PsychologyBooks = () => {
    return (
        <CategoryBooks 
            categorySlug="tam-ly-hoc" 
            categoryName="Tâm Lý Học"
            limit={12}
        />
    );
};

// Component cho sách lịch sử
export const HistoryBooks = () => {
    return (
        <CategoryBooks 
            categorySlug="lich-su" 
            categoryName="Lịch Sử"
            limit={12}
        />
    );
};

// Component cho sách công nghệ
export const TechnologyBooks = () => {
    return (
        <CategoryBooks 
            categorySlug="cong-nghe" 
            categoryName="Công Nghệ"
            limit={12}
        />
    );
};
