import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { AntNotification } from "@components/global/notification";
import { QuillEditor } from "@components/editor/quilleditor";
import ChapterService from "@/services/api-chapters";
import Breadcrumb from "@components/admin/breadcrumb";
import { Upload, Progress, message } from "antd";

const Update_Chapter = () => {
    const navigate = useNavigate();
    const [editorData, setEditorData] = useState('');
    const [chapter, setChapter] = useState(null);
    const { chapterId } = useParams();
    const [audioFile, setAudioFile] = useState('');
    const location = useLocation();
    const [selectedFormatMappingId, setSelectedFormatMappingId] = useState(null);

    // --- State cho progress ---
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState("normal"); // normal, active, success, exception

    // Breadcrumb items
    const book_id = new URLSearchParams(location.search).get("book_id");

    const breadcrumbItems = [
        { label: "Quản Trị", path: "/admin" },
        { label: "Quản Lý Sách", path: "/admin/books" },
        { label: "Quản Lý Chương Sách", path: `/admin/books/chapters/${book_id}` },
        { label: "Cập Nhật Chương", path: null },
    ];

    const handleEditorChange = (data) => {
        setEditorData(data);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await ChapterService.getById(chapterId);
                setEditorData(res.content);
                setChapter(res);
                setSelectedFormatMappingId(res.book_format_mapping_id);
            } catch (error) {
                AntNotification.handleError(error);
            }
        };
        fetchData();
    }, [chapterId, location.search]);

    const handSubmit = async (e) => {
        e.preventDefault();

        setIsSubmitting(true);
        setSubmitStatus("active");
        setUploadProgress(0);

        const form = e.target;
        const data = new FormData(form);

        if (chapter.book_format_mapping.format_id === 2) {
            data.append("audio_path", audioFile);
        }
        if (chapter.book_format_mapping.format_id === 1) {
            data.append("content", editorData);
        }
        data.append("book_format_mapping_id", selectedFormatMappingId);
        data.append("book_id", chapter.book_format_mapping.book_id);

        // Giả lập tiến trình upload
        const progressInterval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 90) return prev;
                return prev + Math.random() * 20;
            });
        }, 300);

        try {
            const res = await ChapterService.update(chapterId, data);

            clearInterval(progressInterval);
            setUploadProgress(100);
            setSubmitStatus("success");

            if (res) {
                AntNotification.showNotification(
                    "Cập nhật thành công",
                    "Chương đã được cập nhật thành công!" || res.message,
                    "success"
                );
                setTimeout(() => {
                    navigate(
                        "/admin/books/chapters/" +
                            chapter.book_format_mapping.book_id +
                            "?type=" +
                            (chapter.book_format_mapping.format_id === 2
                                ? "audio"
                                : "ebook")
                    );
                }, 1000);
            } else {
                setSubmitStatus("exception");
                AntNotification.showNotification(
                    "Có lỗi xảy ra",
                    "Cập nhật chương thất bại!" || res.message,
                    "error"
                );
            }
        } catch (error) {
            clearInterval(progressInterval);
            setUploadProgress(100);
            setSubmitStatus("exception");
            AntNotification.handleError(error);
        } finally {
            setTimeout(() => {
                setIsSubmitting(false);
                setUploadProgress(0);
                setSubmitStatus("normal");
            }, 2000);
        }
    };

    const uploadFile = {
        multiple: false,
        accept: ".mp3,.wav,.ogg,.m4a",
        maxCount: 1,
        showUploadList: false,
        beforeUpload(file) {
            const isAudio = file.type.startsWith("audio/");
            if (!isAudio) {
                message.error("Chỉ được phép tải lên file âm thanh (.mp3, .wav, .ogg, .m4a)");
                return Upload.LIST_IGNORE;
            }

            const isLt50M = file.size / 1024 / 1024 < 50;
            if (!isLt50M) {
                message.error("File phải nhỏ hơn 50MB!");
                return Upload.LIST_IGNORE;
            }

            setAudioFile(file);
            message.success(`Đã chọn file ${file.name}`);
            return false;
        },
        onRemove() {
            setAudioFile(null);
        },
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
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                            Tiêu đề
                        </label>
                        <input
                            type="text"
                            value={chapter?.title || ""}
                            name="title"
                            style={{ borderRadius: "4px", padding: "11px" }}
                            placeholder="Nhập tiêu đề chương"
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                            onChange={(e) => setChapter({ ...chapter, title: e.target.value })}
                        />
                    </div>

                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                            Thứ tự chương
                        </label>
                        <input
                            type="number"
                            value={chapter?.chapter_order || ""}
                            name="chapter_order"
                            style={{ borderRadius: "4px", padding: "11px" }}
                            placeholder="Nhập thứ tự chương"
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                            onChange={(e) =>
                                setChapter({ ...chapter, chapter_order: e.target.value })
                            }
                        />
                    </div>

                    {/* Nếu là ebook */}
                    {chapter?.book_format_mapping?.format_id === 1 && (
                        <div className="mb-5">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                                Nội dung chương
                            </label>
                            <QuillEditor
                                onChange={handleEditorChange}
                                dataEditor={chapter?.content}
                            />
                        </div>
                    )}

                    {/* Nếu là audio */}
                    {chapter?.book_format_mapping?.format_id === 2 && (
                        <div className="mb-5">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                                File Audio
                            </label>
                            <Upload {...uploadFile}>
                                <div className="flex items-center px-4 py-2 text-sm font-medium cursor-pointer text-white bg-blue-600 rounded hover:bg-blue-700">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fill="none"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1.5"
                                            d="M12 4.5v10m0-10c-.7 0-2.008 1.994-2.5 2.5M12 4.5c.7 0 2.008 1.994 2.5 2.5m5.5 9.5c0 2.482-.518 3-3 3H7c-2.482 0-3-.518-3-3"
                                        />
                                    </svg>
                                    <span className="ml-2">
                                        {audioFile ? "Thay đổi file" : "Chọn file audio"}
                                    </span>
                                </div>
                            </Upload>

                            {audioFile && (
                                <div className="mt-3 p-3 bg-gray-50 rounded border">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700">
                                            📁 {audioFile.name}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
                                        </span>
                                    </div>
                                    <div className="mt-2 flex items-center text-green-600 text-sm">
                                        ✅ File đã sẵn sàng để upload
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Thanh tiến trình */}
                    {isSubmitting && (
                        <div className="mb-5 p-4 bg-blue-50 rounded border border-blue-200">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-blue-700">
                                    Đang tải lên chương...
                                </span>
                                <span className="text-sm text-blue-600">
                                    {Math.round(uploadProgress)}%
                                </span>
                            </div>

                            <Progress
                                percent={Math.round(uploadProgress)}
                                status={submitStatus}
                                strokeColor={{ "0%": "#1890ff", "100%": "#52c41a" }}
                                showInfo={false}
                            />

                            {submitStatus === "success" && (
                                <div className="mt-2 flex items-center text-green-600 text-sm">
                                    ✅ Cập nhật thành công! Đang chuyển hướng...
                                </div>
                            )}

                            {submitStatus === "exception" && (
                                <div className="mt-2 flex items-center text-red-600 text-sm">
                                    ❌ Có lỗi xảy ra khi tải lên!
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50"
                    >
                        {isSubmitting ? "Đang xử lý..." : "Cập nhật Chương"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Update_Chapter;
