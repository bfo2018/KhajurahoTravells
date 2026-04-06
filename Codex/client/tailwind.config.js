/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        sand: "#f4e7d4",
        dune: "#d88f52",
        forest: "#264237",
        bronze: "#8a4d26",
        ink: "#1f1a17"
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 20px 60px rgba(77, 43, 18, 0.12)"
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(circle at top left, rgba(255,214,153,0.8), transparent 28%), radial-gradient(circle at right, rgba(216,143,82,0.24), transparent 24%), linear-gradient(135deg, rgba(255,248,240,0.96), rgba(248,238,223,0.92))"
      }
    }
  },
  plugins: []
};
