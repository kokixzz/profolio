/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./builder.html", "./index.html", "./scripts/*.js"],
    theme: {
      extend: {
        colors: {
          primary: "#4F46E5",  // Indigo
          "primary-dark": "#3730a3", // Darker indigo for hover states
          accent: "#F59E0B",   // Amber
          "accent-dark": "#d97706", // Darker amber for hover states
          dark: "#1F2937",     // Gray-800
        },
        fontFamily: {
          sans: ["Inter", "sans-serif"],
        },
        animation: {
          'fade-in': 'fadeIn 0.5s ease-in-out',
          'slide-up': 'slideUp 0.6s ease-in-out',
          'bounce-light': 'bounce 1s infinite ease-in-out',
          'pulse-slow': 'pulse 3s infinite',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          slideUp: {
            '0%': { transform: 'translateY(20px)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          },
        },
        transitionProperty: {
          'height': 'height',
          'spacing': 'margin, padding',
        }
      },
    },
    plugins: [
      require("@tailwindcss/forms"),    // For form styling
    ],
  };