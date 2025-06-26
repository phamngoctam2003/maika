import { useState, useRef, useEffect } from 'react';

export default function MediaPlayer() {
    const [isPlaying, setIsPlaying] = useState(true); // Playing by default like in image
    const [currentTime, setCurrentTime] = useState(1);
    const [duration, setDuration] = useState(294); // 4:54 in seconds
    const [isLiked, setIsLiked] = useState(false);
    const [isVisible, setIsVisible] = useState(false); // Control visibility of the player
    const [volume, setVolume] = useState(80);
    const progressRef = useRef(null);

    // Format time to MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Handle play/pause
    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    // Handle progress bar click
    const handleProgressClick = (e) => {
        if (progressRef.current) {
            const rect = progressRef.current.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const newTime = (clickX / width) * duration;
            setCurrentTime(newTime);
        }
    };

    // Progress percentage
    const progressPercentage = (currentTime / duration) * 100;

    if (!isVisible) return null; // Don't render the player if not visible
    return (
        <div className="bg-black text-white w-full flex items-center justify-center fixed bottom-0 left-0 z-50">

            {/* Main Player Bar - Full Width */}
            <div className="w-full bg-gray-900 border-t border-gray-700">

                {/* Player Container */}
                <div className="flex items-center justify-between px-4 py-3 max-w-full">

                    {/* Left Section - Track Info */}
                    <div className="flex items-center gap-3 min-w-0 flex-1 max-w-xs lg:max-w-sm">
                        {/* Album Art */}
                        <div className="flex-shrink-0">
                            <img
                                src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=60&h=60&fit=crop&crop=center"
                                alt="Album Art"
                                className="w-14 h-14 rounded object-cover"
                            />
                        </div>

                        {/* Track Info */}
                        <div className="min-w-0 flex-1">
                            <h3 className="text-white text-sm font-medium truncate">
                                Ngũ ngôn làm giàu chủ...
                            </h3>
                            <p className="text-gray-400 text-xs truncate">
                                Ngô Hoàng Liên
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
                            <button className="p-2 rounded-full text-gray-400 hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.59 13.51l6.83 3.98m-.01-10.98l-6.82 3.98" /></g></svg>
                            </button>
                        </div>
                    </div>

                    {/* Center Section - Player Controls */}
                    <div className="flex flex-col items-center gap-2 flex-1 max-w-2xl px-4">

                        {/* Control Buttons */}
                        <div className="flex items-center gap-4">
                            {/* Speed indicator */}
                            <div className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                                1,0
                            </div>

                            {/* Shuffle/Random */}
                            <button className="text-gray-400 hover:text-white transition-colors">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M14.83 13.41L13.42 14.82L16.55 17.95L14.5 20H20V14.5L17.95 16.55L14.83 13.41ZM14.5 4L16.55 6.05L13.42 9.18L14.83 10.59L17.95 7.46L20 9.5V4H14.5ZM10.59 9.17L5.41 4L4 5.41L9.17 10.58L10.59 9.17ZM15.41 15.59L20.59 21L19.18 22.41L13.77 17L15.41 15.59Z" />
                                </svg>
                            </button>

                            {/* Backward 10s */}
                            <button className="text-gray-400 hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 20 20"><path fill="currentColor" d="M4 5.628V3.75a.75.75 0 0 0-1.5 0v3.5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5H5.226C6.42 5.11 8.129 4.25 10 4.25c2.4 0 4.53 1.415 5.655 3.543c.144.273.42.457.729.457c.537 0 .91-.533.668-1.013C15.711 4.579 13.076 2.75 10 2.75c-2.406 0-4.542 1.119-6 2.878Zm4.25 5.122a.75.75 0 0 0-1.238-.57l-1.75 1.5a.75.75 0 1 0 .976 1.14l.512-.44v3.87a.75.75 0 0 0 1.5 0v-5.5ZM15 13.5c0 1.933-.625 3.5-2.5 3.5S10 15.433 10 13.5s.625-3.5 2.5-3.5s2.5 1.567 2.5 3.5Zm-1.5 0c0-.85-.145-1.399-.324-1.688a.59.59 0 0 0-.217-.222c-.069-.038-.204-.09-.459-.09s-.39.052-.46.09a.59.59 0 0 0-.216.223c-.179.288-.324.837-.324 1.687c0 .85.145 1.399.324 1.688a.59.59 0 0 0 .217.222c.069.038.204.09.459.09s.39-.052.46-.09a.59.59 0 0 0 .216-.223c.179-.288.324-.837.324-1.687Z" /></svg>
                            </button>

                            {/* Previous */}
                            <button className="text-gray-400 hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.5 3v18m4.726-8.22l8.65 6.92a1 1 0 0 0 1.624-.78V5.08a1 1 0 0 0-1.625-.78l-8.649 6.92a1 1 0 0 0 0 1.56Z" /></svg>
                            </button>

                            {/* Play/Pause */}
                            <button
                                onClick={togglePlayPause}
                                className="p-2 rounded-full bg-white text-black hover:scale-105 transition-transform"
                            >
                                {isPlaying ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5"><rect width="5" height="16.5" x="5" y="3.75" rx="2" /><rect width="5" height="16.5" x="14" y="3.75" rx="2" /></g></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="-4 -3 24 24"><path fill="currentColor" d="M13.82 9.523a.976.976 0 0 0-.324-1.363L3.574 2.128a1.031 1.031 0 0 0-.535-.149c-.56 0-1.013.443-1.013.99V15.03c0 .185.053.366.153.523c.296.464.92.606 1.395.317l9.922-6.031c.131-.08.243-.189.325-.317zm.746 1.997l-9.921 6.031c-1.425.867-3.3.44-4.186-.951A2.918 2.918 0 0 1 0 15.03V2.97C0 1.329 1.36 0 3.04 0c.567 0 1.123.155 1.605.448l9.921 6.032c1.425.866 1.862 2.696.975 4.088c-.246.386-.58.712-.975.952z" /></svg>
                                )}
                            </button>

                            {/* Next */}
                            <button className="text-gray-400 hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.5 3v18m-4.726-8.22l-8.65 6.92a1 1 0 0 1-1.624-.78V5.08a1 1 0 0 1 1.625-.78l8.649 6.92a1 1 0 0 1 0 1.56Z" /></svg>
                            </button>

                            {/* Forward 10s */}
                            <button className="text-gray-400 hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 20 20"><path fill="currentColor" d="M15.733 5.628V3.75a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-.75.75h-4a.75.75 0 0 1 0-1.5h2.025c-1.195-1.39-2.903-2.25-4.775-2.25c-2.399 0-4.53 1.415-5.655 3.543a.834.834 0 0 1-.728.457c-.538 0-.911-.533-.67-1.013C4.023 4.579 6.658 2.75 9.734 2.75c2.406 0 4.542 1.119 6 2.878ZM12.501 17c1.875 0 2.5-1.567 2.5-3.5s-.625-3.5-2.5-3.5s-2.5 1.567-2.5 3.5s.625 3.5 2.5 3.5Zm.677-1.813a.59.59 0 0 1-.217.223c-.07.038-.204.09-.46.09c-.255 0-.39-.052-.459-.09a.59.59 0 0 1-.217-.223c-.178-.288-.324-.837-.324-1.687c0-.85.146-1.399.324-1.688a.59.59 0 0 1 .217-.222c.07-.038.204-.09.46-.09c.255 0 .39.052.459.09a.59.59 0 0 1 .217.223c.178.288.323.837.323 1.687c0 .85-.145 1.399-.323 1.688ZM8.25 10.75a.75.75 0 0 0-1.238-.57l-1.75 1.5a.75.75 0 1 0 .977 1.14l.511-.44v3.87a.75.75 0 0 0 1.5 0v-5.5Z" /></svg>
                            </button>

                            {/* Repeat */}
                            <button className="text-green-500">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M7 7H17V10L21 6L17 2V5H5V11H7V7ZM17 17H7V14L3 18L7 22V19H19V13H17V17Z" />
                                </svg>
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
                                    className="h-full bg-green-500 rounded-full relative"
                                    style={{ width: `${progressPercentage}%` }}
                                >
                                    <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                            </div>

                            <span className="text-xs text-gray-400 w-10">
                                {formatTime(duration)}
                            </span>
                        </div>
                    </div>

                    {/* Right Section - Volume and Menu */}
                    <div className="flex items-center gap-4 min-w-0 flex-1 max-w-xs lg:max-w-sm justify-end">

                        {/* Additional controls for larger screens */}
                        {/* <div className="hidden lg:flex items-center gap-2">
                            <button className="text-gray-400 hover:text-white transition-colors p-1">
                                <MessageCircle className="w-4 h-4" />
                            </button>
                            <button className="text-gray-400 hover:text-white transition-colors p-1">
                                <Users className="w-4 h-4" />
                            </button>
                        </div> */}

                        {/* Menu/Queue */}
                        <button className="text-gray-400 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 100 100"><path fill="currentColor" d="M88.721 20.13H26.258a3.407 3.407 0 0 0-3.407 3.407v3.143a3.407 3.407 0 0 0 3.407 3.407h62.463a3.407 3.407 0 0 0 3.407-3.407v-3.143a3.407 3.407 0 0 0-3.407-3.407zm0 24.892H26.258a3.407 3.407 0 0 0-3.407 3.407v3.143a3.407 3.407 0 0 0 3.407 3.407h62.463a3.407 3.407 0 0 0 3.407-3.407v-3.143a3.407 3.407 0 0 0-3.407-3.407zm0 24.891H26.258a3.407 3.407 0 0 0-3.407 3.407v3.143a3.407 3.407 0 0 0 3.407 3.407h62.463a3.407 3.407 0 0 0 3.407-3.407V73.32a3.408 3.408 0 0 0-3.407-3.407z" /><circle cx="12.856" cy="25.108" r="4.984" fill="currentColor" /><circle cx="12.856" cy="49.002" r="4.984" fill="currentColor" /><circle cx="12.856" cy="74.891" r="4.984" fill="currentColor" /></svg>
                        </button>

                        {/* Volume Control */}
                        <div className="flex items-center gap-2">
                            <button className="text-gray-400 hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5L6 9H2v6h4l5 4V5zm4.54 3.46a5 5 0 0 1 0 7.07m3.53-10.6a10 10 0 0 1 0 14.14" /></svg>
                            </button>
                            <div className="hidden md:flex items-center">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={volume}
                                    onChange={(e) => setVolume(e.target.value)}
                                    className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer volume-slider"
                                />
                            </div>
                        </div>
                        <button
                            onClick={() => setIsVisible(false)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M12 23c6.075 0 11-4.925 11-11S18.075 1 12 1S1 5.925 1 12s4.925 11 11 11m-1.414-11l-3.293 3.293l1.414 1.414L12 13.414l3.293 3.293l1.414-1.414L13.414 12l3.293-3.293l-1.414-1.414L12 10.586L8.707 7.293L7.293 8.707z" clipRule="evenodd" /></svg>
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}