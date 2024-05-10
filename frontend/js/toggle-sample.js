/* // toggle-sample.js (old code)
document.addEventListener('DOMContentLoaded', function() {
    const toggleSampleCardLink = document.querySelector('.samples-menu');
    const togglePricingCardLink = document.querySelector('.pricing-menu');
    const sampleCard = document.querySelector('.sample-card');
    const pricingCard = document.querySelector('.pricing-popup');
    const mainContent = document.querySelector('main');
    const overlay = document.createElement('div');
    
    // Initialize overlay styles
    overlay.className = 'overlay'; // Ensure this class is applied for initial CSS styling
    overlay.style.position = 'absolute';
    overlay.style.top = '63px';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '97.75%';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
    overlay.style.zIndex = '998';
    document.body.appendChild(overlay);

    // Toggle visibility of the sample card and overlay
    toggleSampleCardLink.addEventListener('click', function(e) {
        e.preventDefault();
        sampleCard.classList.toggle('show');
        overlay.classList.toggle('show');
        pricingCard.classList.remove('show'); // Close pricing card
        togglePricingCardLink.disabled = true; // Deactivate pricing button
        if (sampleCard.classList.contains('show')) {
            mainContent.style.position = 'relative';
            sampleCard.style.zIndex = '999';
            togglePricingCardLink.disabled = true; // Deactivate pricing button
        } else {
            togglePricingCardLink.disabled = false; // Reactivate pricing button
        }
    });

    // Hide sample card and overlay when overlay is clicked
    overlay.addEventListener('click', function() {
        sampleCard.classList.remove('show');
        overlay.classList.remove('show');
        togglePricingCardLink.disabled = false; // Reactivate pricing button
    });
}); */

// Shared overlay and event handler initialization
document.addEventListener('DOMContentLoaded', function() {
    const toggleSampleCardLink = document.querySelector('.samples-menu');
    const togglePricingCardLink = document.querySelector('.pricing-menu');
    const sampleCard = document.querySelector('.sample-card');
    const pricingCard = document.querySelector('.pricing-popup');
    const mainContent = document.querySelector('main');
    const existingOverlay = document.querySelector('.overlay');

    let overlay = existingOverlay;
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.style.position = 'absolute';
        overlay.style.top = '63px';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '98.45%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
        overlay.style.zIndex = '998';
        document.body.appendChild(overlay);
    }

    function updateOverlayVisibility() {
        if (sampleCard.classList.contains('show') || pricingCard.classList.contains('show')) {
            overlay.classList.add('show');
        } else {
            overlay.classList.remove('show');
        }
    }

    // Toggle visibility of the sample card
    toggleSampleCardLink.addEventListener('click', function(e) {
        e.preventDefault();
        sampleCard.classList.toggle('show');
        pricingCard.classList.remove('show'); // Ensure pricing card is closed
        updateOverlayVisibility();
        mainContent.style.position = sampleCard.classList.contains('show') ? 'relative' : '';
        sampleCard.style.zIndex = sampleCard.classList.contains('show') ? '999' : '';
    });

    // Toggle visibility of the pricing card
    togglePricingCardLink.addEventListener('click', function(e) {
        e.preventDefault();
        pricingCard.classList.toggle('show');
        sampleCard.classList.remove('show'); // Ensure sample card is closed
        updateOverlayVisibility();
        mainContent.style.position = pricingCard.classList.contains('show') ? 'relative' : '';
        pricingCard.style.zIndex = pricingCard.classList.contains('show') ? '999' : '';
    });

    // Hide both cards and overlay when overlay is clicked
    overlay.addEventListener('click', function() {
        sampleCard.classList.remove('show');
        pricingCard.classList.remove('show');
        updateOverlayVisibility();
    });
});

