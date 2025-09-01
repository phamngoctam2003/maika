import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { AntNotification } from "@components/global/notification";
import { QuillEditor } from "@components/editor/quilleditor";
import ChapterService from "@/services/api-chapters";
import BooksService from "@/services/api-books";
import Breadcrumb from "@components/admin/breadcrumb";
import { Select, Upload, Progress, message } from "antd";

const Create_Chapter = () => {
    const navigate = useNavigate();
    const [editorData, setEditorData] = useState('');
    const [bookInfo, setBookInfo] = useState(null);
    const { bookId } = useParams();
    const [audioFile, setAudioFile] = useState('');
    const location = useLocation();
    const [selectedFormatMappingId, setSelectedFormatMappingId] = useState(null);
    const [bookFormatMappings, setBookFormatMappings] = useState([]);
    
    // Thêm state cho thanh tiến trình
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState('normal'); // 'normal', 'active', 'success', 'exception'

    // Breadcrumb items
    const breadcrumbItems = [
        { label: "Quản Trị", path: "/admin" },
        { label: "Quản Lý Sách", path: "/admin/books" },
        { label: "Quản Lý Chương Sách", path: `/admin/books/chapters/` + bookId },
        { label: "Thêm Chương", path: null },
    ];

    const handleEditorChange = (data) => {
        setEditorData(data);
    };

    // Lấy type từ query param (?type=audio hoặc ?type=ebook)
    const queryType = new URLSearchParams(location.search).get('type');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await BooksService.getById(bookId);
                setBookInfo(res);
                // Lấy danh sách mapping format cho sách này
                if (res && res.book_format_mappings) {
                    // Map thêm format_type dựa vào format_id
                    const mappingsWithType = res.book_format_mappings.map(m => ({
                        ...m,
                        format_type: m.format_id === 1 ? 'ebook' : (m.format_id === 2 ? 'audio' : '')
                    }));
                    setBookFormatMappings(mappingsWithType);
                    // Nếu có type trên url, chọn mapping phù hợp
                    if (queryType) {
                        const found = mappingsWithType.find(m => m.format_type === queryType);
                        if (found) setSelectedFormatMappingId(found.id);
                    } else if (mappingsWithType.length === 1) {
                        setSelectedFormatMappingId(mappingsWithType[0].id);
                    }
                }
            } catch (error) {
                AntNotification.handleError(error);
            }
        }
        fetchData();
    }, [bookId, location.search]);

    const isAudioBook = bookInfo?.formats?.some(f => f.id === 2);
    const isReadableBook = bookInfo?.formats?.some(f => f.id === 1);

    // Xác định loại chương đang chọn
    const selectedFormatId = bookFormatMappings.find(m => m.id === selectedFormatMappingId)?.format_id;

    // Hàm xử lý submit với progress thực tế
    const handSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra bắt buộc chọn loại chương
        if (!selectedFormatMappingId) {
            AntNotification.showNotification("Thiếu thông tin", "Vui lòng chọn loại chương (sách nói hoặc sách điện tử)", "error");
            return;
        }

        // Bắt đầu quá trình submit
        setIsSubmitting(true);
        setSubmitStatus('active');
        setUploadProgress(0);

        const form = e.target;
        const data = new FormData(form);

        if (selectedFormatId === 2) {
            data.append("audio_path", audioFile);
        }
        if (selectedFormatId === 1) {
            data.append("content", editorData);
        }
        data.append("book_format_mapping_id", selectedFormatMappingId);
        
        if (isAudioBook) {
            data.append("audio_path", audioFile);
        }
        if (isReadableBook) {
            data.append("content", editorData);
        }
        data.append("book_id", bookId);

        // Mô phỏng progress upload
        const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 90) return prev; // Dừng ở 90% cho đến khi có response
                return prev + Math.random() * 20;
            });
        }, 300);
        
        try {
            const res = await ChapterService.create(data);
            
            // Hoàn thành progress
            clearInterval(progressInterval);
            setUploadProgress(100);
            setSubmitStatus('success');
            
            if (res) {
                AntNotification.showNotification("Thêm thành công", "Chương đã được thêm thành công!" || res.message, "success");
                setTimeout(() => {
                    navigate("/admin/books/chapters/" + bookId + "?type=" + (audioFile ? "audio" : "ebook"));
                }, 1000); // Delay để user thấy progress hoàn thành
            } else {
                setSubmitStatus('exception');
                AntNotification.showNotification("Có lỗi xảy ra", "Thêm chương thất bại!" || res.message, "error");
            }
        } catch (error) {
            clearInterval(progressInterval);
            setSubmitStatus('exception');
            setUploadProgress(100);
            AntNotification.handleError(error);
        } finally {
            setTimeout(() => {
                setIsSubmitting(false);
                setUploadProgress(0);
                setSubmitStatus('normal');
            }, 2000); // Reset sau 2 giây
        }
    }

    const uploadFile = {
        multiple: false,
        accept: '.mp3,.wav,.ogg,.m4a',
        maxCount: 1,
        showUploadList: false, // Ẩn danh sách upload mặc định
        beforeUpload(file) {
            const isAudio = file.type.startsWith('audio/');
            if (!isAudio) {
                message.error('Chỉ được phép tải lên các file âm thanh (.mp3, .wav, .ogg, .m4a)');
                return Upload.LIST_IGNORE;
            }
            
            // Kiểm tra kích thước file (ví dụ: tối đa 50MB)
            const isLt50M = file.size / 1024 / 1024 < 50;
            if (!isLt50M) {
                message.error('File phải nhỏ hơn 50MB!');
                return Upload.LIST_IGNORE;
            }

            setAudioFile(file);
            message.success(`Đã chọn file ${file.name}`);
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
                        Thêm Chương Sách
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

                    {/* Dropdown chọn loại format */}
                    {bookFormatMappings.length > 1 && (
                        <div className="mb-5">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Loại chương</label>
                            <Select
                                placeholder="Chọn loại chương"
                                value={selectedFormatMappingId}
                                onChange={setSelectedFormatMappingId}
                                className="w-full"
                                options={bookFormatMappings.map(mapping => ({
                                    value: mapping.id,
                                    label: mapping.format_type === 'ebook' ? 'Sách điện tử' : 'Sách nói'
                                }))}
                            />
                        </div>
                    )}
                    
                    {/* Hiển thị phần nhập nội dung nếu là ebook */}
                    {selectedFormatId === 1 && (
                        <div className="mb-5">
                            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Nội dung chương</label>
                            <QuillEditor onChange={handleEditorChange} />
                        </div>
                    )}
                    
                    {/* Hiển thị phần upload audio nếu là audio */}
                    {selectedFormatId === 2 && (
                        <div className="mb-5">
                            <label htmlFor="audio_file" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">File Audio</label>
                            
                            <Upload {...uploadFile}>
                                <div className="flex items-center px-4 py-2 text-sm font-medium cursor-pointer text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.5v10m0-10c-.7 0-2.008 1.994-2.5 2.5M12 4.5c.7 0 2.008 1.994 2.5 2.5m5.5 9.5c0 2.482-.518 3-3 3H7c-2.482 0-3-.518-3-3" color="currentColor" />
                                    </svg>
                                    <span className="ml-2">
                                        {audioFile ? 'Thay đổi file' : 'Chọn file audio'}
                                    </span>
                                </div>
                            </Upload>

                            {/* Hiển thị thông tin file đã chọn */}
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
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        File đã sẵn sàng để upload
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* Hiển thị thanh tiến trình khi đang submit */}
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
                                strokeColor={{
                                    '0%': '#1890ff',
                                    '100%': '#52c41a',
                                }}
                                showInfo={false}
                            />
                            
                            {submitStatus === 'success' && (
                                <div className="mt-2 flex items-center text-green-600 text-sm">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Tải lên thành công! Đang chuyển hướng...
                                </div>
                            )}
                            
                            {submitStatus === 'exception' && (
                                <div className="mt-2 flex items-center text-red-600 text-sm">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    Có lỗi xảy ra khi tải lên!
                                </div>
                            )}
                        </div>
                    )}
                    
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Đang xử lý...
                            </div>
                        ) : 'Thêm Chương'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Create_Chapter;