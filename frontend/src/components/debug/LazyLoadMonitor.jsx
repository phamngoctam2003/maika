import React, { useState, useEffect } from 'react';

const LazyLoadMonitor = () => {
  const [components, setComponents] = useState([
    { name: 'LatestBooks', visible: false, loaded: false, loading: false },
    { name: 'BookRank', visible: false, loaded: false, loading: false },
    { name: 'Propose', visible: false, loaded: false, loading: false }
  ]);

  // Monitor scroll position
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-4 left-4 bg-black bg-opacity-90 text-white p-3 rounded-lg text-xs max-w-xs z-50">
      <h4 className="font-bold mb-2">📊 Lazy Load Monitor</h4>
      
      <div className="mb-2 text-xs opacity-70">
        Scroll: {Math.round(scrollY)}px
      </div>

      <div className="space-y-1">
        {components.map((comp) => (
          <div key={comp.name} className="flex justify-between items-center py-1 px-2 bg-gray-800 rounded">
            <span className="font-medium">{comp.name}</span>
            <div className="flex space-x-1">
              <span className={`w-2 h-2 rounded-full ${comp.visible ? 'bg-blue-400' : 'bg-gray-600'}`} title="Visible"></span>
              <span className={`w-2 h-2 rounded-full ${comp.loading ? 'bg-yellow-400' : 'bg-gray-600'}`} title="Loading"></span>
              <span className={`w-2 h-2 rounded-full ${comp.loaded ? 'bg-green-400' : 'bg-gray-600'}`} title="Loaded"></span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 text-xs opacity-50">
        🔵 Visible | 🟡 Loading | 🟢 Loaded
      </div>

      <div className="mt-2 p-2 bg-gray-800 rounded text-xs">
        <div className="font-semibold mb-1">Instructions:</div>
        <div>1. Scroll down slowly</div>
        <div>2. Watch dots change color</div>
        <div>3. Check browser Network tab</div>
      </div>
    </div>
  );
};

export default LazyLoadMonitor;
