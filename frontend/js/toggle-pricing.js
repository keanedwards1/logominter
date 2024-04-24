/* // toggle-pricing.js
document.addEventListener('DOMContentLoaded', function() {
    const togglePricingCardLink = document.querySelector('.pricing-menu');
    const toggleSampleCardLink = document.querySelector('.samples-menu');
    const pricingCard = document.querySelector('.pricing-popup');
    const sampleCard = document.querySelector('.sample-card');
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

    // Toggle visibility of the pricing card and overlay
    togglePricingCardLink.addEventListener('click', function(e) {
        e.preventDefault();
        pricingCard.classList.toggle('show');
        overlay.classList.toggle('show');
        sampleCard.classList.remove('show'); // Close sample card
        toggleSampleCardLink.disabled = true; // Deactivate sample button
        if (pricingCard.classList.contains('show')) {
            mainContent.style.position = 'relative';
            pricingCard.style.zIndex = '999';
            toggleSampleCardLink.disabled = true; // Deactivate sample button
        } else {
            toggleSampleCardLink.disabled = false; // Reactivate sample button
        }
    });

    // Hide pricing card and overlay when overlay is clicked
    overlay.addEventListener('click', function() {
        pricingCard.classList.remove('show');
        overlay.classList.remove('show');
        toggleSampleCardLink.disabled = false; // Reactivate sample button
    });
});
 */