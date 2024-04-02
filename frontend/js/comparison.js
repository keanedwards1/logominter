
document.addEventListener('DOMContentLoaded', function() {
    range.oninput = () =>
    document.body.style.setProperty('--pos', range.value + '%');
});