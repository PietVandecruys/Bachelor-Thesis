// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8f9fa', // or any light color
        primary: '#ffdf00',    // e.g. a golden color
        secondary: '#eebf00',  // or a slightly darker shade
      },
    },
  },
  plugins: [],
};
