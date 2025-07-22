import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook để tự động điều chỉnh vị trí dropdown để tránh tràn màn hình
 * @param {boolean} isOpen - Trạng thái mở/đóng của dropdown
 * @returns {Object} - Ref cho container và class CSS để áp dụng
 */
export const useDropdownPosition = (isOpen = false) => {
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);
  const [positionClass, setPositionClass] = useState('');

  useEffect(() => {
    if (!isOpen || !containerRef.current || !dropdownRef.current) {
      setPositionClass('');
      return;
    }

    const calculatePosition = () => {
      const container = containerRef.current;
      const dropdown = dropdownRef.current;
      
      if (!container || !dropdown) return;

      const containerRect = container.getBoundingClientRect();
      const dropdownRect = dropdown.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Reset position classes
      dropdown.classList.remove('adjust-left', 'adjust-center', 'adjust-up');

      // Kiểm tra tràn ngang
      const rightOverflow = containerRect.left + dropdown.offsetWidth > viewportWidth - 20;
      const leftOverflow = containerRect.right - dropdown.offsetWidth < 20;

      // Kiểm tra tràn dọc
      const bottomOverflow = containerRect.bottom + dropdown.offsetHeight > viewportHeight - 20;

      let newPositionClass = '';

      // Xử lý tràn ngang
      if (rightOverflow && !leftOverflow) {
        newPositionClass += ' adjust-left';
      } else if (rightOverflow && leftOverflow) {
        newPositionClass += ' adjust-center';
      }

      // Xử lý tràn dọc
      if (bottomOverflow) {
        newPositionClass += ' adjust-up';
      }

      setPositionClass(newPositionClass.trim());
    };

    // Delay nhỏ để đảm bảo dropdown đã render
    const timeoutId = setTimeout(calculatePosition, 10);

    // Tính toán lại khi window resize
    window.addEventListener('resize', calculatePosition);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', calculatePosition);
    };
  }, [isOpen]);

  return {
    containerRef,
    dropdownRef,
    positionClass
  };
};

export default useDropdownPosition;
