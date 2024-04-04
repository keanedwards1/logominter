// Function to execute the desired actions when window width is less than 768px
function handleWindowResize() {
    const windowWidth = window.innerWidth;
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

    if (windowWidth < 768) {
        // Add all event listeners that should work under 768px width
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
    } else {
        // TODO:
        // clear/reset any styles or event listeners if the window width is greater than or equal to 768px
        // For example, reset the infoContainer's style or remove specific event listeners
    }
}

// Execute the function once when the script loads in case the initial width is less than 768px
handleWindowResize();

// Attach the function to the window resize event
window.addEventListener('resize', handleWindowResize);
