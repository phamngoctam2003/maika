import React from 'react';

export default function LinkedAccountForm({ currentUser }) {
  return (
    <div className="max-w-2xl">
      <div className="space-y-6">
        {/* <div className="border border-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-medium mb-2">Facebook</h3>
          <p className="text-gray-400 text-sm mb-3">Chưa liên kết</p>
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white text-sm font-medium transition-colors">
            Liên kết Facebook
          </button>
        </div> */}
        {
          currentUser?.google_id ? (
            <div className="border border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">Google</h3>
              <p className="text-gray-400 text-sm mb-3">Đã liên kết</p>
              {/* <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white text-sm font-medium transition-colors">
                Hủy liên kết Google
              </button> */}
            </div>
          ) :
            (
              <div className="border border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2">Google</h3>
                <p className="text-gray-400 text-sm mb-3">Chưa liên kết</p>
                {/* <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white text-sm font-medium transition-colors">
            Liên kết Google
          </button> */}
              </div>
            )
        }

      </div>
    </div>
  );
}