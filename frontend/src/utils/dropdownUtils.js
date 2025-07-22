// Utility functions for dropdown positioning
export function adjustDropdownPosition() {
  const dropdownContainers = document.querySelectorAll('.dropdown-container, .nav-item-dropdown');
  
  dropdownContainers.forEach(container => {
    const dropdown = container.querySelector('.dropdown-menu');
    if (!dropdown) return;
    
    // Reset classes
    dropdown.classList.remove('adjust-left', 'adjust-center');
    
    container.addEventListener('mouseenter', () => {
      // Get container position
      const containerRect = container.getBoundingClientRect();
      const dropdownRect = dropdown.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      
      // Calculate if dropdown would overflow on the right
      const wouldOverflowRight = containerRect.left + dropdown.offsetWidth > viewportWidth - 20;
      
      // Calculate if dropdown would overflow on the left (when positioned right)
      const wouldOverflowLeft = containerRect.right - dropdown.offsetWidth < 20;
      
      if (wouldOverflowRight && !wouldOverflowLeft) {
        // Position dropdown to the right edge of container
        dropdown.classList.add('adjust-left');
      } else if (wouldOverflowRight && wouldOverflowLeft) {
        // Center dropdown if it would overflow both sides
        dropdown.classList.add('adjust-center');
      }
      // If no overflow, use default left positioning
    });
  });
}

// Initialize dropdown positioning on DOM content loaded
document.addEventListener('DOMContentLoaded', adjustDropdownPosition);

// Re-adjust on window resize
window.addEventListener('resize', adjustDropdownPosition);

// Export for manual triggering if needed
export { adjustDropdownPosition as default };
