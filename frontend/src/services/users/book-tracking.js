import axios from "@/config/axios-customize";

/**
 * Track book view khi người dùng đọc >= 20% nội dung
 * Chỉ ghi nhận 1 lần trong 6 tiếng để tránh spam
 */
export const trackBookView = (slug, getTotalPages, getCurrentAbsolutePage) => {
  const key = `book-viewed-${slug}`;
  const lastViewed = localStorage.getItem(key);
  const now = Date.now();
  const sixHours = 1000 * 60 * 60 * 6;

  const total = getTotalPages();
  const current = getCurrentAbsolutePage();

  // Kiểm tra dữ liệu hợp lệ trước khi tính toán
  if (!total || total <= 0 || !current || current <= 0) {
    console.log(`📚 Dữ liệu chưa sẵn sàng: total=${total}, current=${current}`);
    return;
  }

  const percentRead = (current / total) * 100;

  // Đảm bảo percentRead hợp lệ
  if (isNaN(percentRead) || !isFinite(percentRead) || percentRead > 100) {
    console.log(
      `📚 Phần trăm đọc không hợp lệ: ${percentRead}% (${current}/${total})`
    );
    return;
  }

  console.log(
    `📚 Đã đọc ${percentRead.toFixed(
      2
    )}% sách "${slug}" (trang ${current}/${total})`
  );

  if (
    percentRead >= 20 &&
    (!lastViewed || now - parseInt(lastViewed) > sixHours)
  ) {
    axios
      .post(`/users/${slug}/increase-view`)
      .then(() => {
        localStorage.setItem(key, now.toString());
        console.log("📚 View sách đã được ghi nhận");
      })
      .catch(console.error);
  }
};

/**
 * Lưu tiến độ đọc sách - sử dụng chapter và character position để tránh sai lệch thiết bị
 */
export const saveReadingProgress = (
  slug,
  currentChapter,
  currentPageInChapter,
  bookContent
) => {
  // Throttling - chỉ lưu 1 lần trong 10 giây
  const throttleKey = `progress-throttle-${slug}`;
  const lastSaved = localStorage.getItem(throttleKey);
  const now = Date.now();
  const tenSeconds = 10 * 1000; // 10 giây
  
  if (lastSaved && now - parseInt(lastSaved) < tenSeconds) {
    console.log(`📚 Throttled - Chờ ${Math.ceil((tenSeconds - (now - parseInt(lastSaved))) / 1000)}s nữa mới lưu`);
    return;
  }
  const chapter = currentChapter;

  // Tính character position trong chapter hiện tại thay vì page number
  const currentContent = bookContent[chapter];
  let characterPosition = 0;

  // Tính tổng ký tự từ đầu chapter đến trang hiện tại
  for (let i = 0; i < currentPageInChapter; i++) {
    if (currentContent.pages[i]) {
      characterPosition += currentContent.pages[i].length;
    }
  }

  // Tính phần trăm hoàn thành chapter
  const totalChapterCharacters = currentContent.pages.reduce(
    (total, page) => total + page.length,
    0
  );
  const chapterProgress =
    totalChapterCharacters > 0
      ? (characterPosition / totalChapterCharacters) * 100
      : 0;

  console.log(
    `📚 Lưu tiến độ: "${slug}" - Chương ${
      chapter + 1
    }, vị trí ký tự: ${characterPosition}/${totalChapterCharacters} (${chapterProgress.toFixed(
      1
    )}%)`
  );

  axios.post(`/users/reading-history/save`, {
      book_slug: slug,
      chapter_index: chapter, // Index của chapter
      chapter_id: currentContent.id, // ID của chapter
      character_position: characterPosition, // Vị trí ký tự trong chapter
      chapter_progress: chapterProgress, // Phần trăm hoàn thành chapter
      // device_info: Bỏ phần này để đơn giản hóa
    })
    .then(() => {
      // Cập nhật throttle timestamp sau khi save thành công
      localStorage.setItem(throttleKey, now.toString());
      console.log(`📚 Đã lưu tiến độ thành công: ${chapterProgress.toFixed(1)}%`);
    })
    .catch(console.error);
};

/**
 * Khôi phục vị trí đọc từ server cho thiết bị hiện tại
 */
export const clearBookReadingHistory = (slug) => {
    const key = `book-viewed-${slug}`;
    localStorage.removeItem(key);
};

/**
 * Khôi phục vị trí đọc từ server cho thiết bị hiện tại
 */
export const restoreReadingPosition = async (slug, bookContent) => {
  try {
    const response = await axios.get(`/users/reading-history/${slug}`);
    const data = response;
    // Fix: Kiểm tra đúng cách
    if (!data || data.chapter_index === undefined || data.chapter_index === null) {
      console.log('📚 Không có lịch sử đọc hoặc data không hợp lệ');
      return { chapterIndex: 0, pageIndex: 0 };
    }
    
    const { chapter_index, character_position, chapter_progress } = data;
    // Validate chapter_index
    if (chapter_index < 0 || chapter_index >= bookContent.length) {
      console.warn(`📚 Chapter index không hợp lệ: ${chapter_index}, max: ${bookContent.length - 1}`);
      return { chapterIndex: 0, pageIndex: 0 };
    }

    const targetChapter = bookContent[chapter_index];
    
    if (!targetChapter || !targetChapter.pages) {
      console.warn(`📚 Chapter data không hợp lệ:`, targetChapter);
      return { chapterIndex: 0, pageIndex: 0 };
    }

    // Tính lại page number dựa trên character position cho thiết bị hiện tại
    let accumulatedChars = 0;
    let targetPage = 0;

    for (let i = 0; i < targetChapter.pages.length; i++) {
      const pageCharCount = targetChapter.pages[i].length;
      if (accumulatedChars + pageCharCount >= character_position) {
        targetPage = i;
        break;
      }
      accumulatedChars += pageCharCount;
      targetPage = i + 1; // Nếu vượt quá thì lấy trang cuối
    }

    const finalPageIndex = Math.min(targetPage, targetChapter.pages.length - 1);
    
    console.log(
      `📚 Khôi phục vị trí: Chương ${chapter_index + 1}, trang ${finalPageIndex + 1} (${chapter_progress}%)`
    );

    return {
      chapterIndex: chapter_index,
      pageIndex: finalPageIndex
    };
    
  } catch (error) {
    console.log('📚 Không thể khôi phục vị trí đọc:', error.message);
    return { chapterIndex: 0, pageIndex: 0 }; // Default
  }
};
