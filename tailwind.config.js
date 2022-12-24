const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === "production",
    content: [
      "./index.html",
      "./src/**/*.vue",
      "./src/**/*.js",
      "./src/**/*.ts",
    ],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    transitionDuration: {
      DEFAULT: "300ms",
    },
    animation: {
      pulse: "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
    },
    gradientColorStops: (theme) => ({
      ...theme("colors"),
      transparent: "rgba(255, 255, 255, 0)",
    }),
    extend: {
      colors: {
        cyan: {
          dark: "#29C7B9",
          light: "#e8f7f2",
        },
      },
      fontFamily: {
        sans: ["TTFirsNeue", defaultTheme.fontFamily.sans],
      },
      borderWidth: {
        3: "3px",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      backgroundSize: {
        "50%": "50%",
      },
      backgroundImage: {
        background: "url('../src/assets/images/background.jpg')",
        "minus-icon": "url('../src/assets/images/icons/minus.svg')",
        "plus-icon": "url('../src/assets/images/icons/plus.svg')",
        "location-icon": "url('../src/assets/images/icons/location.svg')",
        "arrows-expand-icon":
          "url('../src/assets/images/icons/arrows-expand.svg')",
        "arrows-shrink-icon":
          "url('../src/assets/images/icons/arrows-shrink.svg')",
        "checked-icon": "url('../src/assets/images/icons/checked.svg')",
      },
      maxWidth: {
        "screen-xl": "1420px",
      },
      margin: {
        4.5: "1.125rem",
      },
      boxShadow: {
        container:
          "0 20px 25px -10px rgba(0, 0, 0, 0.04), 0 10px 10px -10px rgba(0, 0, 0, 0.04)",
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["checked"],
      borderColor: ["checked"],
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
  corePlugins: {},
};
