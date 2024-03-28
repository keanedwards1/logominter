document.addEventListener('DOMContentLoaded', function() {
    const toggleSampleCardLink = document.querySelector('.samples-menu');
    const sampleCard = document.querySelector('.sample-card');
    const mainContent = document.querySelector('main');
    const overlay = document.createElement('div');
    const header = document.querySelector('header');
    
    overlay.style.position = 'absolute';
    overlay.style.top = '63px';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
    overlay.style.zIndex = '1000';
    overlay.style.display = 'none';
    overlay.style.zIndex = 998;
    document.body.appendChild(overlay);

    sampleCard.style.display = 'none'; // Initially hide the sample card

    toggleSampleCardLink.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent the default link action
        if (sampleCard.style.display === 'none' || sampleCard.style.display === '') {
            sampleCard.style.display = 'flex'; // Show the sample card
            overlay.style.display = 'block'; // Show the overlay
            mainContent.style.position = 'relative';
            sampleCard.style.zIndex = '999';
        } else {
            sampleCard.style.display = 'none'; // Hide the sample card
            overlay.style.display = 'none'; // Hide the overlay
        }
    });

    overlay.addEventListener('click', function() {
        sampleCard.style.display = 'none'; // Hide the sample card when overlay is clicked
        overlay.style.display = 'none'; // Hide the overlay
    });

});