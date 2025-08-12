import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { AntNotification } from "@components/global/notification";
import { QuillEditor } from "@components/editor/quilleditor";
import ChapterService from "@/services/api-chapters";
import Breadcrumb from "@components/admin/breadcrumb";
import { Upload } from "antd";
const Update_Chapter = () => {
    const navigate = useNavigate();
    const [editorData, setEditorData] = useState('');
    const [chapter, setChapter] = useState(null);
    const { chapterId } = useParams();
    const [audioFile, setAudioFile] = useState('');
    const location = useLocation();
    const [bookFormatMappings, setBookFormatMappings] = useState([]);
    // Breadcrumb items
    const book_id = new URLSearchParams(location.search).get('book_id');
    const format_id = new URLSearchParams(location.search).get('format_id');

    const breadcrumbItems = [
        { label: "Quản Trị", path: "/admin" },
        { label: "Quản Lý Sách", path: "/admin/books" },
        { label: "Quản Lý Chương Sách", path: `/admin/books/chapters/${book_id}` },
        { label: "Cập Nhật Chương", path: null },
    ];

    const handleEditorChange = (data) => {
        setEditorData(data);
    };

    // Lấy type từ query param (?type=audio hoặc ?type=ebook)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await ChapterService.getById(chapterId);
                if (res) {
                    setEditorData(res.content);
                    console.log(res);
                    setChapter(res);
                    setSelectedFormatMappingId(res.book_format_mapping_id);
                }
            } catch (error) {
                AntNotification.handleError(error);
            }
        }
        fetchData();
    }, [chapterId, location.search]);


    const handSubmit = async (e) => {
        e.preventDefault();


        const form = e.target;
        const data = new FormData(form);

        data.append("audio_path", audioFile);
        data.append("content", editorData);
        data.append("book_format_mapping_id", selectedFormatMappingId);
        // if (imageFile) {
        //     data.append("file_path", imageFile);
        // }
        if (isAudioBook) {
            data.append("audio_path", audioFile);
        }
        if (isReadableBook) {
            data.append("content", editorData);
        }
        data.append("book_id", bookId);
        try {
            const res = await ChapterService.create(data);
            if (res) {
                AntNotification.showNotification("Thêm thành công", "Chương đã được thêm thành công!" || res.message, "success");
                navigate("/admin/books/chapters/" + bookId + "?type=" + (audioFile ? "audio" : "ebook"));
            } else {
                AntNotification.showNotification("Có lỗi xảy ra", "Thêm chương thất bại!" || res.message, "error");

            }
        } catch (error) {
            AntNotification.handleError(error);
        }
    }

    const uploadFile = {
        multiple: false,
        accept: '.mp3,.wav,.ogg,.m4a',
        maxCount: 1,
        beforeUpload(file) {
            const isAudio = file.type.startsWith('audio/');
            if (!isAudio) {
                message.error('Chỉ được phép tải lên các file âm thanh (.mp3, .wav, .ogg, .m4a)');
                return Upload.LIST_IGNORE;
            }
            setAudioFile(file); // lưu file vào state cha
            return false; // ngăn antd upload tự động
        },
        onRemove() {
            setAudioFile(null);
        }
    };

    return (
        <div className="pt-16 px-4 lg:ml-64">
            <Breadcrumb items={breadcrumbItems} />
            <div className="bg-white shadow rounded-lg mb-4 p-4 h-full">
                <div className="flex justify-between items-center my-2">
                    <h5 className="text-xl font-medium leading-tight text-primary">
                        Cập nhật chương sách
                    </h5>
                </div>
                <form className="max-w-lg mt-5" onSubmit={handSubmit}>
                    <div className="mb-5">
                        <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tiêu đề</label>
                        <input type="text"
                            name="title"
                            style={{ borderRadius: '4px', padding: '11px' }}
                            placeholder="Nhập tiêu đề chương"
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="chapter_order" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Thứ tự chương</label>
                        <input type="number"
                            name="chapter_order"
                            style={{ borderRadius: '4px', padding: '11px' }}
                            placeholder="Nhập thứ tự chương"
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                        />
                    </div>
                    {/* Hiển thị phần nhập nội dung nếu là ebook */}
                    <div className="mb-5">
                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Nội dung chương</label>
                        <QuillEditor onChange={handleEditorChange} dataEditor={editorData} />
                    </div>
                    {/* Hiển thị phần upload audio nếu là audio */}
                    <div className="mb-5">
                        <label htmlFor="audio_file" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">File Audio</label>
                        <Upload
                            {...uploadFile}
                        >
                            <div className="flex items-center px-4 py-2 text-sm font-medium cursor-pointer text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.5v10m0-10c-.7 0-2.008 1.994-2.5 2.5M12 4.5c.7 0 2.008 1.994 2.5 2.5m5.5 9.5c0 2.482-.518 3-3 3H7c-2.482 0-3-.518-3-3" color="currentColor" /></svg>
                                <span className="ml-2">Tải lên audio</span>
                            </div>
                        </Upload>
                    </div>
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default Update_Chapter;