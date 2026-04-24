/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bank: {
          dark:   "#0A0E1A",
          card:   "#111827",
          border: "#1F2937",
          accent: "#C8A84B",
          red:    "#DC2626",
          green:  "#16A34A",
          muted:  "#6B7280",
          light:  "#F9FAFB",
        }
      },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] }
    },
  },
  plugins: [],
}
