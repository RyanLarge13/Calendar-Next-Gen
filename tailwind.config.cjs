/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {listStyleType: {
      disc: 'disc',
    },},
  },
  plugins: [],
};
