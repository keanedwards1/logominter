module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./frontend/**/*.{html,js,css}", // Includes all HTML, JS, and CSS files in the frontend directory
    "./*.{html,js,css}", // Includes all HTML, JS, and CSS files in the root directory
    "./backend/app/**/*.{js,py}", // Includes JavaScript and Python files in the backend/app directory, if you ever decide to mix Tailwind classes in server-side templates or scripts
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#bae6fd",

          secondary: "#e0f2fe",

          accent: "#d8b4fe",

          neutral: "#e9d5ff",

          "base-100": "#fee2e2",

          info: "#bae6fd",

          success: "#4d7c0f",

          warning: "#fb923c",

          error: "#c2410c",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
