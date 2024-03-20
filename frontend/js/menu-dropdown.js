let activeDropdown = null; // Currently active (visible) dropdown
let hideTimeout = null; // Timeout for hiding dropdown

// Function to clear the hide timeout
function clearHideTimeout() {
  if (hideTimeout) {
    clearTimeout(hideTimeout);
    hideTimeout = null;
  }
}

// Function to set the active dropdown
function setActiveDropdown(dropdownId) {
  // Hide the currently active dropdown
  if (activeDropdown && activeDropdown !== dropdownId) {
    const activeDropdownElement = document.getElementById(activeDropdown);
    if (activeDropdownElement) { // Check if the element exists before hiding
      activeDropdownElement.style.display = 'none';
    }
  }
  // Show the new dropdown and update the activeDropdown variable
  if (dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    if (dropdown) { // Ensure the dropdown exists before attempting to show it
      activeDropdown = dropdownId;
      dropdown.style.display = 'block';
    }
  }
}

function handleMenuItemEnter(menuItem) {
    const menuId = menuItem.getAttribute('data-menu');
    if (menuId && document.getElementById(menuId)) { // Check if the dropdown exists
      const rect = menuItem.getBoundingClientRect();
      const navLinksRect = document.querySelector('.nav-links').getBoundingClientRect();
      const dropdown = document.getElementById(menuId);
  
      // Example: Adjust these values to move the dropdown left/right (-value/+value) and up/down (-value/+value)
      const horizontalOffset = -50; // Move dropdown right or left
      const verticalOffset = 1;  // Move dropdown up or down
  
      // Calculate and adjust the left position relative to the nav-links container, including the horizontalOffset
      const adjustedLeft = (rect.left - navLinksRect.left) + horizontalOffset;
  
      // Calculate the adjusted top position, including the verticalOffset
      const adjustedTop = (rect.bottom - navLinksRect.top) + verticalOffset;
  
      // Set the adjusted top and left positions
      dropdown.style.left = `${adjustedLeft}px`;
      dropdown.style.top = `${adjustedTop}px`;
    
      setActiveDropdown(menuId);
    } else {
      // If hovering over an item without a dropdown, hide any active dropdown
      scheduleDropdownHideImmediate();
    }
  }
  
  
function scheduleDropdownHideImmediate() {
  clearHideTimeout(); // Clear any existing timeout
  hideTimeout = setTimeout(() => {
    // Hide any active dropdown
    if (activeDropdown) {
      const dropdown = document.getElementById(activeDropdown);
      if (dropdown) { // Check if the dropdown exists before attempting to hide it
        dropdown.style.opacity = 'none';
      }
      activeDropdown = null; // Reset active dropdown
    }
  }, 100); // Immediate hide without delay
}

document.querySelectorAll('.nav-links a').forEach(item => {
  item.addEventListener('mouseenter', function() {
    clearHideTimeout(); // Cancel any scheduled hide action
    handleMenuItemEnter(this); // Handle entering the menu item
  });
});

// Schedule the dropdown to hide when leaving the nav-links container
document.querySelector('.nav-links').addEventListener('mouseleave', scheduleDropdownHideImmediate);

document.addEventListener('DOMContentLoaded', function() {
    // Assuming .dropdown is always next to .nav-links a you want to target
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
      let navLink = dropdown.previousElementSibling; // Gets the <a> element before .dropdown

      dropdown.addEventListener('mouseenter', function() {
        navLink.classList.add('hover-effect'); // Adds the class to simulate hover
      });

      dropdown.addEventListener('mouseleave', function() {
        navLink.classList.remove('hover-effect'); // Removes the class when mouse leaves
      });
    });
  });
  
  document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const dynamicArrow = document.querySelector('.dynamic-arrow');
    const dynamicArrowShadow = document.querySelector('.dynamic-arrow-shadow'); // Get the shadow element
  
    navLinks.forEach((link, index) => {
      link.addEventListener('mouseenter', function() {
        // Only proceed if the hovered link is not the last child
        if (index !== navLinks.length - 1) {
          const linkRect = link.getBoundingClientRect();
          const navLinksRect = link.closest('.nav-links').getBoundingClientRect();
  
          // Calculate the new position of the arrow and shadow
          const newLeft = linkRect.left + linkRect.width / 2 - navLinksRect.left;
  
          // Move the arrow
          dynamicArrow.style.left = `${newLeft - 15}px`; // Center the arrow based on its width
          dynamicArrow.style.opacity = 1; // Show the arrow
  
          // Move the shadow to match the arrow's position
          dynamicArrowShadow.style.left = `${newLeft - 32}px`; // Center the shadow based on its width
          dynamicArrowShadow.style.opacity = 1; // Show the shadow
        } else {
          // Hide the arrow and shadow when hovering over the last link
          dynamicArrow.style.opacity = 0;
          dynamicArrowShadow.style.opacity = 0;
        }
      });
  
      link.closest('.nav-links').addEventListener('mouseleave', function() {
        // Hide the arrow and shadow when not hovering over the links
        dynamicArrow.style.opacity = 0;
        dynamicArrowShadow.style.opacity = 0;
      });
    });
  });
  
  