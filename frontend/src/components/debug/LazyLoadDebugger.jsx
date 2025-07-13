import React, { useState, useEffect } from 'react';

const LazyLoadDebugger = () => {
  const [loadStates, setLoadStates] = useState({
    latest: { loading: false, loaded: false, visible: false },
    ranking: { loading: false, loaded: false, visible: false },
    proposed: { loading: false, loaded: false, visible: false }
  });

  const [screenInfo, setScreenInfo] = useState({
    width: 0,
    height: 0,
    type: 'desktop'
  });

  useEffect(() => {
    const updateScreenInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      let type = 'desktop';
      
      if (width < 640) type = 'mobile';
      else if (width < 1024) type = 'tablet';
      
      setScreenInfo({ width, height, type });
    };

    updateScreenInfo();
    window.addEventListener('resize', updateScreenInfo);
    return () => window.removeEventListener('resize', updateScreenInfo);
  }, []);

  return (
    <div className="fixed top-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs max-w-xs z-50">
      <h4 className="font-bold mb-2">🐛 Lazy Load Debug</h4>
      
      {/* Screen Info */}
      <div className="mb-3 p-2 bg-gray-800 rounded">
        <div className="font-semibold">📱 Screen: {screenInfo.type}</div>
        <div>{screenInfo.width} x {screenInfo.height}</div>
      </div>

      {/* Component States */}
      <div className="space-y-2">
        <div className="p-2 bg-blue-900 rounded">
          <div className="font-semibold">📚 Latest Books (P1)</div>
          <div>👁️ Visible: {loadStates.latest.visible ? '✅' : '❌'}</div>
          <div>⏳ Loading: {loadStates.latest.loading ? '🔄' : '⏸️'}</div>
          <div>✅ Loaded: {loadStates.latest.loaded ? '✅' : '❌'}</div>
        </div>

        <div className="p-2 bg-green-900 rounded">
          <div className="font-semibold">🏆 Ranking (P2)</div>
          <div>👁️ Visible: {loadStates.ranking.visible ? '✅' : '❌'}</div>
          <div>⏳ Loading: {loadStates.ranking.loading ? '🔄' : '⏸️'}</div>
          <div>✅ Loaded: {loadStates.ranking.loaded ? '✅' : '❌'}</div>
        </div>

        <div className="p-2 bg-purple-900 rounded">
          <div className="font-semibold">💡 Proposed (P3)</div>
          <div>👁️ Visible: {loadStates.proposed.visible ? '✅' : '❌'}</div>
          <div>⏳ Loading: {loadStates.proposed.loading ? '🔄' : '⏸️'}</div>
          <div>✅ Loaded: {loadStates.proposed.loaded ? '✅' : '❌'}</div>
        </div>
      </div>

      <div className="mt-3 text-xs opacity-70">
        P1 = Priority 1 (highest)<br/>
        P2 = Priority 2 (medium)<br/>
        P3 = Priority 3 (lowest)
      </div>
    </div>
  );
};

export default LazyLoadDebugger;
