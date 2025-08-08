import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import HomeService from "@/services/users/api-home";

const FormSearch = () => {
    const URL_IMG = import.meta.env.VITE_URL_IMG;
    const [keyword, setKeyword] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const navigate = useNavigate();
    const inputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/search?keyword=${encodeURIComponent(keyword.trim())}`);
            setKeyword("");
            setShowSuggestions(false);
        }
    };

    useEffect(() => {
        if (!keyword.trim()) {
            setSuggestions([]);
            return;
        }
        const debounceTimer = setTimeout(() => {
            fetchData(keyword);
        }, 400);
        return () => clearTimeout(debounceTimer);
    }, [keyword]);

    const fetchData = async (kw) => {
        try {
            const response = await HomeService.getBookSearch({ keyword: kw });
            setSuggestions(response.data || []);
        } catch (error) {
            setSuggestions([]);
        }
    };

    // Ẩn suggestions khi click ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="form-search relative" ref={inputRef}>
            <form onSubmit={handleSubmit} autoComplete="off">
                <div className="box">
                    <div className="container-2">
                        <input
                            className="search"
                            placeholder="Tìm kiếm..."
                            value={keyword}
                            onChange={e => {
                                setKeyword(e.target.value);
                                setShowSuggestions(true);
                            }}
                            aria-label="Search"
                            onFocus={() => keyword && setShowSuggestions(true)}
                        />
                        <button type="submit" className="icon1" aria-label="Tìm kiếm">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M11 2C15.968 2 20 6.032 20 11C20 15.968 15.968 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2ZM11 18C14.8675 18 18 14.8675 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18ZM19.4853 18.0711L22.3137 20.8995L20.8995 22.3137L18.0711 19.4853L19.4853 18.0711Z"></path>
                            </svg>
                        </button>
                    </div>
                    {showSuggestions && suggestions.length > 0 && (
                        <ul
                            className="suggestions-list absolute left-0 right-0 top-full bg-color-root z-10 shadow-lg max-h-64 overflow-y-auto mt-1 rounded
                            scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
                            style={{
                                // fallback for browsers not supporting Tailwind's scrollbar utilities
                                scrollbarWidth: "thin",
                                scrollbarColor: "#d1d5db transparent"
                            }}
                        >
                            {suggestions.map((item, idx) => (
                                <Link
                                    key={item.id || idx}
                                    to={`/ebook/${item.slug}`}
                                    className="flex gap-3 px-2 py-1 cursor-pointer hover:bg-gray-900 transition-colors"
                                    onClick={() => {
                                        setKeyword(item.title || "");
                                        setShowSuggestions(false);
                                    }}
                                >
                                    {item.file_path ? (
                                        <img
                                            src={URL_IMG + item.file_path}
                                            alt={item.title}
                                            className="w-8 h-12 object-cover rounded shadow-sm bg-gray-100"
                                        />
                                    ) : (
                                        <div className="w-8 h-12 bg-gray-200 rounded"/>
                                    )}
                                    <span className="font-medium line-clamp-2 text-start lg:text-base text-sm">{item.title}</span>
                                </Link>
                            ))}
                        </ul>
                    )}
                </div>
            </form>
        </div>
    );
}

export default FormSearch;