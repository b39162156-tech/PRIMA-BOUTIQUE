/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        pink: {
          DEFAULT: "#ff4fa3",
          dark: "#e0388a",
          light: "#ffe6f2",
        },
        gold: {
          DEFAULT: "#D4AF37",
          light: "#f6ecc9",
        },
        graylight: "#f5f5f5",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        card: "0 4px 16px rgba(0,0,0,0.05)",
        cardHover: "0 14px 28px rgba(0,0,0,0.10)",
      },
    },
  },
  plugins: [],
};
