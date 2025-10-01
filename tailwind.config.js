/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#171717",
        primary: "#4f46e5", // indigo
        secondary: "#f3f4f6", // light gray
        accent: "#f59e0b", // amber
        error: "#ef4444",
        success: "#22c55e",
      },
      fontFamily: {
        body: ["Inter", "Arial", "sans-serif"],
        display: ["var(--font-racing-sans)", "sans-serif"], 
      },
    },
  },
  plugins: [require("daisyui")],
};
