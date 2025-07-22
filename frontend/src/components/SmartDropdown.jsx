import React, { useState } from 'react';
import useDropdownPosition from '../hooks/useDropdownPosition';

const SmartDropdown = ({ trigger, children, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { containerRef, dropdownRef, positionClass } = useDropdownPosition(isOpen);

  return (
    <div 
      ref={containerRef}
      className={`dropdown-container ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="dropdown-trigger">
        {trigger}
        <svg 
          className={`dropdown-icon ${isOpen ? 'rotate-180' : ''}`}
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M7 10l5 5 5-5z"/>
        </svg>
      </div>
      
      <div 
        ref={dropdownRef}
        className={`dropdown-menu ${positionClass} ${isOpen ? 'visible' : ''}`}
      >
        {children}
      </div>
    </div>
  );
};

// Example usage component
const NavigationWithSmartDropdown = () => {
  return (
    <nav className="navigation">
      <SmartDropdown 
        trigger="Danh mục sách"
        className="nav-item-dropdown"
      >
        <div className="dropdown-grid">
          <a href="#" className="dropdown-item">Tiểu thuyết</a>
          <a href="#" className="dropdown-item">Khoa học viễn tưởng</a>
          <a href="#" className="dropdown-item">Trinh thám</a>
          <a href="#" className="dropdown-item">Tâm lý học</a>
          {/* Thêm nhiều items khác */}
        </div>
        
        <div className="explore-section">
          <div className="explore-title">Khám phá thêm</div>
          <div className="explore-grid">
            <a href="#" className="explore-item">
              <span>📚</span>
              Tất cả thể loại
            </a>
            <a href="#" className="explore-item">
              <span>⭐</span>
              Sách hay nhất
            </a>
          </div>
        </div>
      </SmartDropdown>
    </nav>
  );
};

export { SmartDropdown, NavigationWithSmartDropdown };
export default SmartDropdown;
