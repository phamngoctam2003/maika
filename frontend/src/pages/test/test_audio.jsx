import React, { useRef, useState, useEffect } from 'react';

const AudioPlayer = () => {
  const audioRef = useRef(null); // Ref để truy cập phần tử audio
  const [duration, setDuration] = useState(0); // Tổng thời gian của audio
  const [currentTime, setCurrentTime] = useState(10); // Thời gian hiện tại của audio

  // Cập nhật tổng thời gian khi audio được tải
  useEffect(() => {
    const audio = audioRef.current;
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  // Hàm để tua audio khi người dùng thay đổi thanh trượt
  const handleSeek = (e) => {
    const newTime = e.target.value;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <div>
      <audio
        ref={audioRef}
        controls 
        src="/audio/videoplayback.m4a"
      />
      
      {/* Thanh tua audio tùy chỉnh */}
      <div>
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={handleSeek}
          step="0.01"
        />
        <span>
          {Math.floor(currentTime)}s / {Math.floor(duration)}s
        </span>
      </div>
    </div>
  );
};

export default AudioPlayer;