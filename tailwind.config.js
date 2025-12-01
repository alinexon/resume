/** @type {import('tailwindcss').Config} */
module.exports = {
  class: "dark",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // ✅ App Router pages & layouts
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // ✅ Components folder
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // ✅ If you still have any legacy pages
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
