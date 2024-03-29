document.addEventListener('DOMContentLoaded', function() {
    const toggleSampleCardLink = document.querySelector('.samples-menu');
    const sampleCard = document.querySelector('.sample-card');
    const mainContent = document.querySelector('main');
    const overlay = document.createElement('div');
    
    // Initialize overlay styles
    overlay.className = 'overlay'; // Ensure this class is applied for initial CSS styling
    overlay.style.position = 'absolute';
    overlay.style.top = '63px';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '96%';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
    overlay.style.zIndex = '998';
    document.body.appendChild(overlay);

    // Toggle visibility of the sample card and overlay
    toggleSampleCardLink.addEventListener('click', function(e) {
        e.preventDefault();
        sampleCard.classList.toggle('show');
        overlay.classList.toggle('show');
        if (sampleCard.classList.contains('show')) {
            mainContent.style.position = 'relative';
            sampleCard.style.zIndex = '999';
        }
    });

    // Hide sample card and overlay when overlay is clicked
    overlay.addEventListener('click', function() {
        sampleCard.classList.remove('show');
        overlay.classList.remove('show');
    });
});
