
export default function ProfileTabs({ selectedTab, setSelectedTab }) {
  const tabs = [
    { id: 'personal', label: 'Thông tin cá nhân' },
    // { id: 'address', label: 'Địa chỉ' },
    { id: 'security', label: 'Bảo mật' },
    { id: 'linked', label: 'Tài khoản liên kết' }
  ];

  return (
    <div className="flex flex-wrap gap-1 mb-8 border-b border-gray-700">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setSelectedTab(tab.id)}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            selectedTab === tab.id
              ? 'text-green-400 border-green-400'
              : 'text-gray-400 border-transparent hover:text-gray-300'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}