import { useState, useRef, useEffect } from 'react';
import { useBook } from '@/contexts/book_context';
import DetailService from '@/services/users/api-detail';
import { AntNotification } from "@components/global/notification";

export default function MediaPlayer() {
    const URL_PATH = import.meta.env.VITE_URL_IMG;
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(294); // 4:54 in seconds
    const [isLiked, setIsLiked] = useState(false);
    const [volume, setVolume] = useState(80);
    const [chapters, setChapters] = useState([]);
    const [currentChapter, setCurrentChapter] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [lastProgressSaveTime, setLastProgressSaveTime] = useState(0); // Track last save time
    const [isSeeking, setIsSeeking] = useState(false); // Track seeking state
    const progressRef = useRef(null);
    const audioRef = useRef(null);
    // Flag để auto play khi audio đã sẵn sàng
    const shouldAutoPlay = useRef(false);

    const { openAudioModal, setOpenAudioModal, isAudioPlaying, setIsAudioPlaying, currentBook } = useBook();

    // Load chapters khi có book ID
    useEffect(() => {               
        const loadChapters = async () => {
            if (currentBook?.id && openAudioModal) {
                setIsLoading(true);
                try {
                    // Gọi API thực tế để lấy chapters
                    const chaptersResponse = await DetailService.getBookChapters(currentBook.id);
                    const chaptersData = chaptersResponse.data || chaptersResponse;

                    if (chaptersData && chaptersData.length > 0) {
                        setChapters(chaptersData);

                        // Nếu có resumeChapterId thì phát chương đó, không thì phát chương đầu
                        let targetChapter = chaptersData[0];
                        if (currentBook.resumeChapterId) {
                            const found = chaptersData.find(ch => ch.id === currentBook.resumeChapterId);
                            if (found) targetChapter = found;
                        }
                        setCurrentChapter(targetChapter);
                        setLastProgressSaveTime(0); // Reset progress save time

                        try {
                            const audioResponse = await DetailService.getChapterAudio(currentBook.id, targetChapter.id);
                            const audioData = audioResponse.data || audioResponse;
                            if (audioRef.current && audioData.audioUrl) {
                                audioRef.current.src = audioData.audioUrl;
                                audioRef.current.load(); // Load the audio
                                setDuration(audioData.duration || 0);

                                // Nếu có resumeTime thì seek đến đó sau khi loadedmetadata
                                if (currentBook.resumeTime && audioRef.current) {
                                    audioRef.current.onloadedmetadata = () => {
                                        audioRef.current.currentTime = currentBook.resumeTime;
                                        setCurrentTime(currentBook.resumeTime);
                                    };
                                }
                            } else {
                                // Fallback: tạo URL từ path có sẵn
                                if (targetChapter.audio_path) {
                                    const fallbackUrl = URL_PATH + targetChapter.audio_path;
                                    if (audioRef.current) {
                                        audioRef.current.src = fallbackUrl;
                                        audioRef.current.load();
                                        // Seek nếu có resumeTime
                                        if (currentBook.resumeTime && audioRef.current) {
                                            audioRef.current.onloadedmetadata = () => {
                                                audioRef.current.currentTime = currentBook.resumeTime;
                                                setCurrentTime(currentBook.resumeTime);
                                            };
                                        }
                                    }
                                }
                            }
                        } catch (audioError) {
                            // Fallback: sử dụng audio_path từ chapter data
                            if (targetChapter.audio_path && audioRef.current) {
                                const fallbackUrl = URL_PATH + targetChapter.audio_path;
                                audioRef.current.src = fallbackUrl;
                                audioRef.current.load();
                                // Seek nếu có resumeTime
                                if (currentBook.resumeTime && audioRef.current) {
                                    audioRef.current.onloadedmetadata = () => {
                                        audioRef.current.currentTime = currentBook.resumeTime;
                                        setCurrentTime(currentBook.resumeTime);
                                    };
                                }
                            }
                            AntNotification.showNotification(
                                "Lỗi tải audio",
                                "Không thể tải nội dung audio của chương đầu tiên",
                                "error"
                            );
                        }
                    } else {
                        console.warn('No chapters found for this book');
                        AntNotification.showNotification(
                            "Không có nội dung",
                            "Sách này chưa có nội dung audio",
                            "warning"
                        );
                    }
                } catch (error) {
                    console.error('Error loading chapters:', error);
                    AntNotification.showNotification(
                        "Lỗi tải dữ liệu",
                        "Không thể tải danh sách chương",
                        "error"
                    );
                } finally {
                    setIsLoading(false);
                }
            }
        };

        loadChapters();
    }, [currentBook?.id, openAudioModal]);

    // Auto play/pause when isAudioPlaying changes from outside
    useEffect(() => {
        if (audioRef.current && currentChapter) {
            if (isAudioPlaying) {
                // Đánh dấu sẽ auto play khi audio ready
                shouldAutoPlay.current = true;
                // Nếu audio đã sẵn sàng thì play luôn
                if (audioRef.current.readyState >= 3) {
                    audioRef.current.play()
                    .then(() => {
                        shouldAutoPlay.current = false;
                    })
                    .catch(error => {
                        AntNotification.showNotification(
                            "Lỗi phát audio",
                            "Không thể phát audio. Kiểm tra file audio có tồn tại không.",
                            "error"
                        );
                        shouldAutoPlay.current = false;
                    });
                }
            } else {
                audioRef.current.pause();
                shouldAutoPlay.current = false;
            }
        }
    }, [isAudioPlaying, currentChapter]);

    // Audio event listeners để handle seeking
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleSeeking = () => {
            setIsSeeking(true);
        };

        const handleSeeked = () => {
            setIsSeeking(false);
            if (audio) {
                setCurrentTime(audio.currentTime);
            }
        };

        const handleLoadedData = () => {
            if (audio.duration && !isNaN(audio.duration)) {
                setDuration(audio.duration);
                setCurrentTime(0); // Reset current time khi load audio mới
            }
        };

        const handleCanPlay = () => {
            if (audio.duration && !isNaN(audio.duration)) {
                setDuration(audio.duration);
            }
        };

        audio.addEventListener('seeking', handleSeeking);
        audio.addEventListener('seeked', handleSeeked);
        audio.addEventListener('loadeddata', handleLoadedData);
        audio.addEventListener('canplay', handleCanPlay);

        return () => {
            audio.removeEventListener('seeking', handleSeeking);
            audio.removeEventListener('seeked', handleSeeked);
            audio.removeEventListener('loadeddata', handleLoadedData);
            audio.removeEventListener('canplay', handleCanPlay);
        };
    }, [currentChapter]);

    // Format time to MM:SS
    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Handle play/pause
    const togglePlayPause = () => {
        setIsAudioPlaying(!isAudioPlaying);
        // Audio sẽ được control bởi useEffect ở trên
    };
    
    // Handle chapter change
    const changeChapter = async (chapterId) => {
        const selectedChapter = chapters.find(ch => ch.id === chapterId);
        if (!selectedChapter) return;

        setIsLoading(true);
        setLastProgressSaveTime(0); // Reset progress save time khi chuyển chương
        try {
            setCurrentChapter(selectedChapter);
            setCurrentTime(0);

            // Lấy audio của chapter được chọn
            try {
                const audioResponse = await DetailService.getChapterAudio(currentBook.id, chapterId);
                const audioData = audioResponse.data || audioResponse;

                if (audioRef.current && audioData.audioUrl) {
                    audioRef.current.src = audioData.audioUrl;
                    audioRef.current.load();
                    setDuration(audioData.duration || 0);

                    if (isAudioPlaying) {
                        await audioRef.current.play();
                    }
                } else {
                    // Fallback: sử dụng audio_path từ chapter data
                    if (selectedChapter.audio_path && audioRef.current) {
                        const fallbackUrl = URL_PATH + selectedChapter.audio_path;
                        audioRef.current.src = fallbackUrl;
                        audioRef.current.load();

                        if (isAudioPlaying) {
                            await audioRef.current.play();
                        }
                    }
                }
            } catch (audioError) {
                // Fallback: sử dụng audio_path từ chapter data
                if (selectedChapter.audio_path && audioRef.current) {
                    const fallbackUrl = URL_PATH + selectedChapter.audio_path;
                    console.log('Chapter error fallback URL:', fallbackUrl);
                    audioRef.current.src = fallbackUrl;
                    audioRef.current.load();

                    if (isAudioPlaying) {
                        await audioRef.current.play();
                    }
                }
            }
        } catch (error) {
            AntNotification.showNotification(
                "Lỗi chuyển chương",
                "Không thể tải nội dung của chương này",
                "error"
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Handle audio time update - chỉ update khi không đang seek và có data hợp lệ
    const handleTimeUpdate = () => {
        if (!audioRef.current || isSeeking) {
            return;
        }

        const newCurrentTime = audioRef.current.currentTime;
        const audioDuration = audioRef.current.duration;
        
        // Kiểm tra giá trị hợp lệ
        if (isNaN(newCurrentTime) || newCurrentTime < 0) {
            console.warn('Invalid currentTime:', newCurrentTime);
            return;
        }

        // Chỉ update khi có sự thay đổi đáng kể (tránh flickering)
        if (Math.abs(newCurrentTime - currentTime) > 0.1) {
            setCurrentTime(newCurrentTime);
        }

        // Update duration nếu chưa có hoặc thay đổi
        if (audioDuration && !isNaN(audioDuration) && audioDuration > 0 && Math.abs(audioDuration - duration) > 0.1) {
            setDuration(audioDuration);
        }

        // Auto save progress mỗi 10 giây - chỉ save 1 lần trong 10 giây
        if (currentChapter && newCurrentTime > 0 && audioDuration > 0) {
            const currentSeconds = Math.floor(newCurrentTime);
            const shouldSave = currentSeconds % 10 === 0 && currentSeconds !== lastProgressSaveTime;
            
            if (shouldSave) {
                setLastProgressSaveTime(currentSeconds);
                const progress = (newCurrentTime / audioDuration) * 100;
                
                DetailService.updateListeningProgress(currentBook.id, currentChapter.id, {
                    current_time: newCurrentTime,
                    duration: audioDuration,
                    progress_percentage: progress
                })
                .catch(error => console.error('Error saving progress:', error));
            }
        }
    };

    // Handle next/previous chapter
    const nextChapter = () => {
        const currentIndex = chapters.findIndex(ch => ch.id === currentChapter?.id);
        if (currentIndex < chapters.length - 1) {
            changeChapter(chapters[currentIndex + 1].id);
        }
    };

    const prevChapter = () => {
        const currentIndex = chapters.findIndex(ch => ch.id === currentChapter?.id);
        if (currentIndex > 0) {
            changeChapter(chapters[currentIndex - 1].id);
        }
    };

    // Handle progress bar click - cải thiện logic với validation tốt hơn
    const handleProgressClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!progressRef.current || !audioRef.current) {
            console.warn('Progress ref or audio ref not available');
            return;
        }

        // Kiểm tra audio đã sẵn sàng chưa
        if (audioRef.current.readyState < 2) {
            console.warn('Audio not ready for seeking, readyState:', audioRef.current.readyState);
            return;
        }

        // Kiểm tra duration hợp lệ
        const audioDuration = audioRef.current.duration;
        if (!audioDuration || isNaN(audioDuration) || audioDuration <= 0) {
            console.warn('Invalid audio duration:', audioDuration);
            return;
        }
        
        setIsSeeking(true);
        
        const rect = progressRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        
        // Đảm bảo clickX trong phạm vi hợp lệ
        const clampedClickX = Math.max(0, Math.min(clickX, width));
        const percentage = clampedClickX / width;
        const newTime = percentage * audioDuration;
        
        // Đảm bảo newTime trong phạm vi hợp lệ
        const clampedNewTime = Math.max(0, Math.min(newTime, audioDuration - 0.1));
        
        try {
            // Set thời gian mới
            audioRef.current.currentTime = clampedNewTime;
        } catch (error) {
            setIsSeeking(false);
            return;
        }
        
        // Kết thúc seeking sau khi audio đã seek xong
        const handleSeekEnd = () => {
            setIsSeeking(false);
            setCurrentTime(audioRef.current.currentTime);
            audioRef.current.removeEventListener('seeked', handleSeekEnd);
        };
        
        audioRef.current.addEventListener('seeked', handleSeekEnd);
        
        // Fallback timeout
        setTimeout(() => {
            if (isSeeking) {
                setIsSeeking(false);
            }
        }, 1000);
    };

    // Handle seek to specific time - cải thiện với validation
    const seekTo = (seconds) => {
        if (!audioRef.current) {
            console.warn('Audio ref not available for seeking');
            return;
        }

        // Kiểm tra audio sẵn sàng
        if (audioRef.current.readyState < 2) {
            console.warn('Audio not ready for seeking, readyState:', audioRef.current.readyState);
            return;
        }

        const audioDuration = audioRef.current.duration;
        if (!audioDuration || isNaN(audioDuration) || audioDuration <= 0) {
            console.warn('Invalid audio duration for seeking:', audioDuration);
            return;
        }
        
        setIsSeeking(true);
        
        const clampedSeconds = Math.max(0, Math.min(seconds, audioDuration - 0.1));
        
        try {
            audioRef.current.currentTime = clampedSeconds;
        } catch (error) {
            setIsSeeking(false);
            return;
        }
        
        // Wait for seeked event
        const handleSeekEnd = () => {
            setIsSeeking(false);
            setCurrentTime(audioRef.current.currentTime);
            audioRef.current.removeEventListener('seeked', handleSeekEnd);
        };
        
        audioRef.current.addEventListener('seeked', handleSeekEnd);
        
        // Fallback
        setTimeout(() => {
            if (isSeeking) {
                setIsSeeking(false);
            }
        }, 1000);
    };

    // Thêm functions tua nhanh 10 giây với validation
    const skip10Forward = () => {
        if (!audioRef.current) return;
        
        const currentPos = audioRef.current.currentTime || 0;
        const audioDuration = audioRef.current.duration || duration;
        const newTime = Math.min(currentPos + 10, audioDuration - 0.1);
        seekTo(newTime);
    };

    const skip10Backward = () => {
        if (!audioRef.current) return;
        
        const currentPos = audioRef.current.currentTime || 0;
        const newTime = Math.max(currentPos - 10, 0);
        seekTo(newTime);
    };

    // Progress percentage
    const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

    if (!openAudioModal) return null;
    
    return (
        <div className="bg-black text-white w-full flex items-center justify-center fixed bottom-0 left-0 z-50">
            {/* Hidden Audio Element */}
            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={() => {
                    // Lấy duration chính xác từ metadata của audio file
                    if (audioRef.current) {
                        const audioDuration = audioRef.current.duration;
                        if (audioDuration && !isNaN(audioDuration)) {
                            setDuration(audioDuration);
                            setCurrentTime(0);
                            console.log('Metadata loaded, duration:', audioDuration);
                        }
                    }
                }}
                onEnded={nextChapter}
                onCanPlay={() => {
                    // Audio đã sẵn sàng để phát
                    console.log('Audio ready to play');
                    if (audioRef.current && audioRef.current.duration) {
                        setDuration(audioRef.current.duration);
                    }
                    // Nếu flag auto play đang bật thì play
                    if (shouldAutoPlay.current && isAudioPlaying) {
                        audioRef.current.play()
                        .then(() => {
                            console.log('Auto play on canplay success');
                            shouldAutoPlay.current = false;
                        })
                        .catch(error => {
                            AntNotification.showNotification(
                                "Lỗi phát audio",
                                "Không thể phát audio. Kiểm tra file audio có tồn tại không.",
                                "error"
                            );
                            shouldAutoPlay.current = false;
                        });
                    }
                }}
                onError={(e) => {
                    console.error('Audio error:', e.target.error);
                    AntNotification.showNotification(
                        "Lỗi phát audio",
                        "Không thể phát file audio này",
                        "error"
                    );
                }}
            />

            {/* Main Player Bar - Full Width */}
            <div className="w-full bg-gray-900 border-t border-gray-700">

                {/* Player Container */}
                <div className="flex items-center justify-between md:px-4 px-2 py-3 max-w-full">

                    {/* Left Section - Track Info */}
                    <div className="flex items-center gap-3 min-w-0 flex-1 max-w-xs lg:max-w-sm">
                        {/* Album Art */}
                        <div className="flex-shrink-0 lg:block hidden  ">
                            <img
                                src={currentBook?.file_path ? URL_PATH + currentBook.file_path : "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=60&h=60&fit=crop&crop=center"}
                                alt="Album Art"
                                className="w-14 h-14 rounded object-cover"
                            />
                        </div>

                        {/* Track Info */}
                        <div className="min-w-0 flex-1 hidden md:block">
                            <h3 className="text-white text-sm font-medium truncate">
                                {currentChapter?.title || currentBook?.title || "Ngũ ngôn làm giàu chủ..."}
                            </h3>
                            <p className="text-gray-400 text-xs truncate">
                                {currentBook?.authors?.[0]?.name || "Không có tác giả"}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setIsLiked(!isLiked)}
                                className={`p-2 rounded-full transition-colors ${isLiked ? 'text-green-500' : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 1024 1024"><path fill="currentColor" d="M287.984 114.16c31.376 0 88.094 15.008 180.094 105.616l45.616 44.912l44.928-45.632c63.872-64.896 131.84-105.2 177.376-105.2c61.408 0 109.809 21.008 157.009 68.096c44.464 44.368 68.992 103.36 68.992 166.112c.032 62.784-24.448 121.824-69.408 166.672c-3.664 3.712-196.992 212.304-358.96 387.104c-7.632 7.248-16.352 8.32-20.991 8.32c-4.576 0-13.2-1.024-20.8-8.096c-39.472-43.905-325.552-362-358.815-395.232C88.497 462.416 64 403.376 64 340.608c.015-62.752 24.511-121.728 69.04-166.144c43.295-43.264 93.984-60.304 154.944-60.304zm-.002-64c-76.528 0-144 22.895-200.176 79.008c-117.072 116.768-117.072 306.128 0 422.96c33.424 33.44 357.855 394.337 357.855 394.337c18.48 18.496 42.753 27.68 66.96 27.68c24.225 0 48.4-9.184 66.912-27.68c0 0 354.88-383.024 358.656-386.85c117.04-116.88 117.04-306.24 0-423.007c-58.112-58-123.024-86.784-202.208-86.784c-75.648 0-160 60.32-223.008 124.32C447.981 110.159 366.237 50.16 287.981 50.16z" /></svg>
                            </button>
                        </div>
                    </div>

                    {/* Center Section - Player Controls */}
                    <div className="flex flex-col items-center gap-2 flex-1 max-w-2xl px-4">

                        {/* Control Buttons */}
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={skip10Backward}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 20 20"><path fill="currentColor" d="M4 5.628V3.75a.75.75 0 0 0-1.5 0v3.5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5H5.226C6.42 5.11 8.129 4.25 10 4.25c2.4 0 4.53 1.415 5.655 3.543c.144.273.42.457.729.457c.537 0 .91-.533.668-1.013C15.711 4.579 13.076 2.75 10 2.75c-2.406 0-4.542 1.119-6 2.878Zm4.25 5.122a.75.75 0 0 0-1.238-.57l-1.75 1.5a.75.75 0 1 0 .976 1.14l.512-.44v3.87a.75.75 0 0 0 1.5 0v-5.5ZM15 13.5c0 1.933-.625 3.5-2.5 3.5S10 15.433 10 13.5s.625-3.5 2.5-3.5s2.5 1.567 2.5 3.5Zm-1.5 0c0-.85-.145-1.399-.324-1.688a.59.59 0 0 0-.217-.222c-.069-.038-.204-.09-.459-.09s-.39.052-.46.09a.59.59 0 0 0-.216.223c-.179.288-.324.837-.324 1.687c0 .85.145 1.399.324 1.688a.59.59 0 0 0 .217.222c.069.038.204.09.459.09s.39-.052.46-.09a.59.59 0 0 0 .216-.223c.179-.288.324-.837.324-1.687Z" /></svg>
                            </button>

                            {/* Previous */}
                            <button
                                onClick={prevChapter}
                                disabled={chapters.findIndex(ch => ch.id === currentChapter?.id) === 0}
                                className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.5 3v18m4.726-8.22l8.65 6.92a1 1 0 0 0 1.624-.78V5.08a1 1 0 0 0-1.625-.78l-8.649 6.92a1 1 0 0 0 0 1.56Z" /></svg>
                            </button>

                            {/* Play/Pause */}
                            <button
                                onClick={togglePlayPause}
                                disabled={isLoading}
                                className="p-2 rounded-full bg-white text-black hover:scale-105 transition-transform disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <svg className="animate-spin w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : isAudioPlaying ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5"><rect width="5" height="16.5" x="5" y="3.75" rx="2" /><rect width="5" height="16.5" x="14" y="3.75" rx="2" /></g></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="-4 -3 24 24"><path fill="currentColor" d="M13.82 9.523a.976.976 0 0 0-.324-1.363L3.574 2.128a1.031 1.031 0 0 0-.535-.149c-.56 0-1.013.443-1.013.99V15.03c0 .185.053.366.153.523c.296.464.92.606 1.395.317l9.922-6.031c.131-.08.243-.189.325-.317zm.746 1.997l-9.921 6.031c-1.425.867-3.3.44-4.186-.951A2.918 2.918 0 0 1 0 15.03V2.97C0 1.329 1.36 0 3.04 0c.567 0 1.123.155 1.605.448l9.921 6.032c1.425.866 1.862 2.696.975 4.088c-.246.386-.58.712-.975.952z" /></svg>
                                )}
                            </button>

                            {/* Next */}
                            <button
                                onClick={nextChapter}
                                disabled={chapters.findIndex(ch => ch.id === currentChapter?.id) === chapters.length - 1}
                                className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.5 3v18m-4.726-8.22l-8.65 6.92a1 1 0 0 1-1.624-.78V5.08a1 1 0 0 1 1.625-.78l8.649 6.92a1 1 0 0 1 0 1.56Z" /></svg>
                            </button>

                            {/* Forward 10s */}
                            <button 
                                onClick={skip10Forward}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 20 20"><path fill="currentColor" d="M15.733 5.628V3.75a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-.75.75h-4a.75.75 0 0 1 0-1.5h2.025c-1.195-1.39-2.903-2.25-4.775-2.25c-2.399 0-4.53 1.415-5.655 3.543a.834.834 0 0 1-.728.457c-.538 0-.911-.533-.67-1.013C4.023 4.579 6.658 2.75 9.734 2.75c2.406 0 4.542 1.119 6 2.878ZM12.501 17c1.875 0 2.5-1.567 2.5-3.5s-.625-3.5-2.5-3.5s-2.5 1.567-2.5 3.5s.625 3.5 2.5 3.5Zm.677-1.813a.59.59 0 0 1-.217.223c-.07.038-.204.09-.46.09c-.255 0-.39-.052-.459-.09a.59.59 0 0 1-.217-.223c-.178-.288-.324-.837-.324-1.687c0-.85.146-1.399.324-1.688a.59.59 0 0 1 .217-.222c.07-.038.204-.09.46-.09c.255 0 .39.052.459.09a.59.59 0 0 1 .217.223c.178.288.323.837.323 1.687c0 .85-.145 1.399-.323 1.688ZM8.25 10.75a.75.75 0 0 0-1.238-.57l-1.75 1.5a.75.75 0 1 0 .977 1.14l.511-.44v3.87a.75.75 0 0 0 1.5 0v-5.5Z" /></svg>
                            </button>

                        </div>

                        {/* Progress Bar */}
                        <div className="flex items-center gap-2 w-full">
                            <span className="text-xs text-gray-400 w-10 text-right">
                                {formatTime(currentTime)}
                            </span>

                            <div
                                ref={progressRef}
                                onClick={handleProgressClick}
                                className="flex-1 h-1 bg-gray-600 rounded-full cursor-pointer group relative"
                            >
                                <div
                                    className="h-full bg-green-500 rounded-full relative transition-all duration-100"
                                    style={{ width: `${progressPercentage}%` }}
                                >
                                    <div className={`absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full transition-opacity ${isSeeking ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
                                </div>
                            </div>

                            <span className="text-xs text-gray-400 w-10">
                                {formatTime(duration)}
                            </span>
                        </div>
                    </div>

                    {/* Right Section - Volume and Menu */}
                    <div className="flex items-center gap-4 min-w-0 flex-1 max-w-xs lg:max-w-sm justify-end">


                        {/* Volume Control */}
                        <div className=" items-center gap-2 md:flex hidden">
                            <button 
                                onClick={() => {
                                    if (audioRef.current) {
                                        audioRef.current.muted = !audioRef.current.muted;
                                    }
                                }}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5L6 9H2v6h4l5 4V5zm4.54 3.46a5 5 0 0 1 0 7.07m3.53-10.6a10 10 0 0 1 0 14.14" /></svg>
                            </button>
                            <div className="hidden md:flex items-center">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={volume}
                                    onChange={(e) => {
                                        const newVolume = e.target.value;
                                        setVolume(newVolume);
                                        if (audioRef.current) {
                                            audioRef.current.volume = newVolume / 100;
                                        }
                                    }}
                                    className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                                    style={{
                                        background: `linear-gradient(to right, #1db954 0%, #1db954 ${volume}%, #4b5563 ${volume}%, #4b5563 100%)`
                                    }}
                                />
                            </div>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={() => {
                                setOpenAudioModal(false);
                                setIsAudioPlaying(false);
                                if (audioRef.current) {
                                    audioRef.current.pause();
                                }
                            }}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M12 23c6.075 0 11-4.925 11-11S18.075 1 12 1S1 5.925 1 12s4.925 11 11 11m-1.414-11l-3.293 3.293l1.414 1.414L12 13.414l3.293 3.293l1.414-1.414L13.414 12l3.293-3.293l-1.414-1.414L12 10.586L8.707 7.293L7.293 8.707z" clipRule="evenodd" /></svg>
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}