module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./frontend/**/*.{html,js,css}", // Includes all HTML, JS, and CSS files in the frontend directory
    "./*.{html,js,css}", // Includes all HTML, JS, and CSS files in the root directory
    "./backend/app/**/*.{js,py}", // Includes JavaScript and Python files in the backend/app directory, if you ever decide to mix Tailwind classes in server-side templates or scripts
  ],
};
