import SlideCarousel from "../../components/ui/slide_swiper";
import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import HomeService from "../../services/client/api-home";

const UserHome = () => {
  const URL_IMG = import.meta.env.VITE_URL_IMG;
  const [latestBooks, setLatestBooks] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    console.time('fetchBooks'); // Bắt đầu đếm thời gian
    const fetchLatestBooks = async () => {
      try {
        const response = await HomeService.getLatets();
        console.timeEnd('fetchBooks'); // Kết thúc đếm
        console.log("Data size:", JSON.stringify(response).length / 1024, "KB");
        setLatestBooks(response);
      } catch (error) {
        console.error("Failed to fetch:", error);
      }
    };
    fetchLatestBooks();
  }, []);
  console.log("Latest books:", latestBooks);
  return (
    <>
      {/* <SlideCarousel /> */}
      <div className="py-12 w-full ">
        <div className="px-4 w-full mx-auto">
          <h2 className="text-3xl font-bold mb-8">Tác Phẩm Kinh Điển</h2>
          <div className="flex overflow-x-auto pb-4 space-x-6 scrollbar-hide">
            {latestBooks.map((book) => (
              <div className="flex-none w-48" key={book.id}>
                <div className="flex flex-col items-center">
                  <a href="#" className="text-center">
                    <img
                      className="w-full h-64 object-cover rounded-lg shadow-md mb-2"
                      src={URL_IMG + book.file_path}
                      alt={book.title}
                    />
                    <p className="text-lg font-medium text-gray-800 hover:text-blue-600">
                      {book?.title}
                    </p>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </>
  );
}
export default UserHome;