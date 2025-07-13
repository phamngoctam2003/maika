import React, { useState } from 'react';
import HomeService from "@/services/users/api-home";

const TestAPI = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testAPI = async (apiName) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let data;
      switch (apiName) {
        case 'latest':
          data = await HomeService.getLatets();
          break;
        case 'ranking':
          data = await HomeService.getRankingBooks();
          break;
        case 'proposed':
          data = await HomeService.getProposedBooks();
          break;
        default:
          throw new Error('Unknown API');
      }
      
      setResult(data);
      console.log(`${apiName} API result:`, data);
    } catch (err) {
      setError(err.message);
      console.error(`${apiName} API error:`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-90 text-white p-4 rounded-lg max-w-md z-50">
      <h3 className="font-bold mb-4">🧪 API Test Tool</h3>
      
      <div className="space-y-2 mb-4">
        <button 
          onClick={() => testAPI('latest')} 
          className="w-full bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm"
          disabled={loading}
        >
          Test Latest Books API
        </button>
        <button 
          onClick={() => testAPI('ranking')} 
          className="w-full bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-sm"
          disabled={loading}
        >
          Test Ranking Books API
        </button>
        <button 
          onClick={() => testAPI('proposed')} 
          className="w-full bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded text-sm"
          disabled={loading}
        >
          Test Proposed Books API
        </button>
      </div>

      {loading && (
        <div className="text-yellow-400 text-sm">
          ⏳ Loading...
        </div>
      )}

      {error && (
        <div className="text-red-400 text-sm bg-red-900 bg-opacity-30 p-2 rounded">
          ❌ Error: {error}
        </div>
      )}

      {result && (
        <div className="text-green-400 text-sm bg-green-900 bg-opacity-30 p-2 rounded max-h-32 overflow-y-auto">
          ✅ Success: {Array.isArray(result) ? `${result.length} items` : 'Data loaded'}
          <pre className="text-xs mt-1 opacity-70">
            {JSON.stringify(result, null, 2).substring(0, 200)}...
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestAPI;
