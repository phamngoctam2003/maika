export const bookContent = [
  {
    id: 1,
    title: "Chương 1: Giới thiệu về Upanishad",
    fullContent: `[Toàn bộ nội dung chương 1...]`,
    pages: [] // Sẽ được xử lý khi tải sách
  },
  {
    id: 2,
    title: "Chương 2: Tư tưởng và triết lý",
    fullContent: `[Toàn bộ nội dung chương 2...]`,
    pages: []
  }
];

// Hàm xử lý chia nội dung thành trang
export const processBookContent = (content) => {
  return content.map(chapter => ({
    ...chapter,
    pages: splitContentIntoPages(chapter.fullContent, 300)
  }));
};

const splitContentIntoPages = (content, wordsPerPage = 300) => {
  const words = content.split(/\s+/);
  const pages = [];
  
  for (let i = 0; i < words.length; i += wordsPerPage) {
    const pageWords = words.slice(i, i + wordsPerPage);
    pages.push(pageWords.join(' '));
  }
  
  return pages;
};