document.addEventListener('DOMContentLoaded', function() {
  var button = document.getElementById('get-started-button');
  
  button.addEventListener('click', function() {
    setTimeout(function() {
      window.location.href = 'your-link.html'; // Replace with your actual URL
    }, 1000); // Delay in milliseconds (1000ms = 1 second)
  });
});