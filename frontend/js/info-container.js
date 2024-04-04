document.addEventListener("DOMContentLoaded", function () {
    var windowWidth = window.innerWidth;

    if (windowWidth < 768) {
        // For The Hamburger
        const infoContainer = document.getElementById("infoContainer");
        const closeButton = document.getElementById("closeButton");
        const infoButton = document.getElementById("info-image");
        const submitButton = document.getElementById("submit-img");
        const themeImage = document.getElementById("theme-image");
        const profileImage = document.getElementById("profile-photo");
    
        let isRectangleVisible = false;
    
        const toggleRectangleVisibility = () => {
        if (isRectangleVisible) {
            infoContainer.style.right = "-420px"; // Hide the rectangle
        } else {
            infoContainer.style.right = "0"; // Show the rectangle
        }
        isRectangleVisible = !isRectangleVisible; // Toggle the variable
        };
    
        infoButton.addEventListener("click", toggleRectangleVisibility);
    
        infoButton.addEventListener("mouseenter", (event) => {
        event.preventDefault();
        if (!isRectangleVisible) {
            infoContainer.style.right = "0"; // Show the rectangle
        }
        });
    
        infoButton.addEventListener("mouseleave", (event) => {
        event.preventDefault();
        if (!isRectangleVisible) {
            infoContainer.style.right = "-420px"; // Hide the rectangle
        }
        });
    
        closeButton.addEventListener("click", (event) => {
        infoContainer.style.right = "-420px"; // Hide the rectangle
        isRectangleVisible = false; // Update the visibility state
        event.stopPropagation(); // Prevent event bubbling
        });
    
        document.addEventListener("keydown", (event) => {
        if ((event.metaKey || event.ctrlKey) && event.key === "i") {
            toggleRectangleVisibility();
        }
        });
    
        document.addEventListener("click", (event) => {
        const target = event.target;
        if (
            isRectangleVisible &&
            target !== infoContainer &&
            !infoContainer.contains(target) &&
            target !== infoButton &&
            target !== themeImage &&
            target !== profileImage &&
            target !== submitButton
        ) {
            toggleRectangleVisibility();
        }
        });
        // reset
        
    }
});