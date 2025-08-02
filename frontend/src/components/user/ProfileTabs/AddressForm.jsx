import React from 'react';

export default function AddressForm() {
  return (
    <div className="max-w-2xl">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Địa chỉ</label>
          <input
            type="text"
            placeholder="Nhập địa chỉ của bạn"
            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded text-white focus:ring-1 focus:ring-green-400 focus:border-green-400 outline-none transition-all"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Thành phố</label>
            <input
              type="text"
              placeholder="Thành phố"
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded text-white focus:ring-1 focus:ring-green-400 focus:border-green-400 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Mã bưu điện</label>
            <input
              type="text"
              placeholder="Mã bưu điện"
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded text-white focus:ring-1 focus:ring-green-400 focus:border-green-400 outline-none transition-all"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 pt-6">
          <button className="bg-green-500 hover:bg-green-600 px-6 py-2.5 rounded text-white font-medium transition-colors">
            Cập nhật
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 px-6 py-2.5 rounded text-white font-medium transition-colors">
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}