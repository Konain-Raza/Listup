/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF", // Custom primary color (blue)
        secondary: "#F59E0B", // Custom secondary color (orange)
        darkButton: "#579DFF", // Custom accent color (green)
        darkBg: "#1D2125",
        darkBlueBgHover: "#152234",
        darkBlueTextHover: "#85B8FF",
        darkRedBgHover: "#331714",
        darkRedTextHover: "FD9891",
        jiraBlue: "#0C66E4",

        darkHeading: "#8C9BAB", // Light background color
        danger: "#DC2626", // Danger color (red)
        success: "#10B981", // Success color (green)
        info: "#3B82F6", // Info color (blue)
        warning: "#FBBF24", // Warning color (yellow)
        muted: "#6B7280", // Muted text color (gray)
      },
    },
  },
  plugins: [require("daisyui")],
};
