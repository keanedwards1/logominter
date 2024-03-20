// Global variables for managing state
let activeDropdown = null; // Currently active (visible) dropdown
let hideTimeout = null; // Timeout for hiding dropdown

// Clears the hide timeout
function clearHideTimeout() {
  if (hideTimeout) {
    clearTimeout(hideTimeout);
    hideTimeout = null;
  }
}

// Sets the active dropdown and hides the previous one if necessary
function setActiveDropdown(dropdownId) {
  if (activeDropdown && activeDropdown !== dropdownId) {
    const activeDropdownElement = document.getElementById(activeDropdown);
    if (activeDropdownElement) {
      activeDropdownElement.style.display = 'none';
    }
  }

  if (dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    if (dropdown) {
      activeDropdown = dropdownId;
      dropdown.style.display = 'block';
    }
  }
}

// Handles menu item mouse enter to set active dropdown
function handleMenuItemEnter(menuItem) {
  const menuId = menuItem.getAttribute('data-menu');
  if (menuId) {
    const dropdown = document.getElementById(menuId);
    if (dropdown) {
      adjustDropdownPosition(menuItem, dropdown);
      setActiveDropdown(menuId);
    }
  } else {
    scheduleDropdownHideImmediate();
  }
}

// Adjusts dropdown position based on nav-links
function adjustDropdownPosition(menuItem, dropdown) {
  const rect = menuItem.getBoundingClientRect();
  const navLinksRect = document.querySelector('.nav-links').getBoundingClientRect();
  const horizontalOffset = -50;
  const verticalOffset = 1;
  dropdown.style.left = `${rect.left - navLinksRect.left + horizontalOffset}px`;
  dropdown.style.top = `${rect.bottom - navLinksRect.top + verticalOffset}px`;
}

// Schedules immediate dropdown hide
function scheduleDropdownHideImmediate() {
  clearHideTimeout();
  hideTimeout = setTimeout(() => {
    if (activeDropdown) {
      const dropdown = document.getElementById(activeDropdown);
      if (dropdown) {
        dropdown.style.display = 'none';
        activeDropdown = null;
      }
    }
  }, 100);
}

// Adds event listeners for dropdown functionality
function setupDropdownListeners() {
  document.querySelectorAll('.nav-links a').forEach(item => {
    item.addEventListener('mouseenter', () => {
      clearHideTimeout();
      handleMenuItemEnter(item);
    });
  });

  document.querySelector('.nav-links').addEventListener('mouseleave', scheduleDropdownHideImmediate);

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.dropdown').forEach(dropdown => {
      const navLink = dropdown.previousElementSibling;
      dropdown.addEventListener('mouseenter', () => navLink.classList.add('hover-effect'));
      dropdown.addEventListener('mouseleave', () => navLink.classList.remove('hover-effect'));
    });

    const navLinks = document.querySelectorAll('.nav-links a');
    const dynamicArrow = document.querySelector('.dynamic-arrow');
    const dynamicArrowShadow = document.querySelector('.dynamic-arrow-shadow');

    navLinks.forEach((link, index) => {
      link.addEventListener('mouseenter', () => adjustArrowAndShadow(link, index, navLinks.length, dynamicArrow, dynamicArrowShadow));
      link.closest('.nav-links').addEventListener('mouseleave', () => {
        dynamicArrow.style.opacity = 0;
        dynamicArrowShadow.style.opacity = 0;
      });
    });
  });
}

// Adjusts the arrow and shadow position
function adjustArrowAndShadow(link, index, totalLinks, arrow, shadow) {
  if (index !== totalLinks - 1) {
    const linkRect = link.getBoundingClientRect();
    const navLinksRect = link.closest('.nav-links').getBoundingClientRect();
    const newLeft = linkRect.left + linkRect.width / 2 - navLinksRect.left;
    arrow.style.left = `${newLeft - 15}px`;
    arrow.style.opacity = 1;
    shadow.style.left = `${newLeft - 32}px`;
    shadow.style.opacity = 1;
  } else {
    arrow.style.opacity = 0;
    shadow.style.opacity = 0;
  }
}

setupDropdownListeners();
