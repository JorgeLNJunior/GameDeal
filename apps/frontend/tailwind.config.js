/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,vue}"],
  theme: {
    extend: {
      width: {
        18: "76px",
      },
      height: {
        120: "30rem",
      },
    },
  },
  plugins: [],
};
