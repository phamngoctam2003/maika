const BookControls = ({ fontSize, setFontSize, brightness, setBrightness }) => (
  <div className="p-4 border-t border-gray-700 bg-gray-800 w-full">
    <div className="flex items-center justify-between max-w-md mx-auto">
      <div className="flex items-center gap-2">
        <span className="text-sm">A</span>
        <input
          type="range"
          min="12"
          max="24"
          value={fontSize}
          onChange={(e) => setFontSize(parseInt(e.target.value))}
          className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-lg">A</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">🌙</span>
        <input
          type="range"
          min="50"
          max="150"
          value={brightness}
          onChange={(e) => setBrightness(parseInt(e.target.value))}
          className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-sm">☀️</span>
      </div>
    </div>
  </div>
);

export default BookControls;
