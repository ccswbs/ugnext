/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

const colors = {
  white: "#fff",
  "white-focus": "#ddd",
  "white-on-dark": "#fff",
  "white-contrast": "#000",

  black: "#000",
  "black-focus": "#444",
  "black-on-light": "#000",
  "black-contrast": "#fff",

  red: "#e51937",
  "red-focus": "#b3142c",
  "red-on-light": "#dc1836",
  "red-contrast": "#fff",

  yellow: "#ffc429",
  "yellow-focus": "#ffe299",
  "yellow-on-dark": "#ffc429",
  "yellow-contrast": "#000",

  blue: "#187bb4",
  "blue-focus": "#135f8b",
  "blue-on-light": "#1775ab",
  "blue-contrast": "#fff",

  green: "#318738",
  "green-focus": "#27682c",
  "green-on-light": "#2e7f35",
  "green-contrast": "#fff",

  "grey-light": "#d8d8d8",
  "grey-light-focus": "#bfbfbf",
  "grey-light-contrast": "#000",
  "grey-light-bg": "#f5f5f5",

  "grey-dark": "#747676",
  "grey-dark-focus": "#63625f",
  "grey-dark-contrast": "#fff",
  "grey-dark-bg": "#222",

  "body-copy": "#555",
  "body-copy-on-light": "#555",
  "body-copy-on-dark": "#ccc",

  "body-copy-bold": "#333",
  "body-copy-bold-on-light": "#333",
  "body-copy-bold-on-dark": "#e2e2e2",

  "body-copy-link": "#187bb4",
  "body-copy-link-on-light": "#166ea2",
  "body-copy-link-on-dark": "#1d93d7",
};

module.exports = {
  content: [
    "./components/**/*.{html,js,jsx,ts,tsx}",
    "./pages/**/*.{html,js,jsx,ts,tsx}",
    "./public/**/*.{html,js,jsx,ts,tsx}",
    "./stories/**/*.{html,js,jsx,ts,tsx}",
  ],
  darkMode: "selector",
  theme: {
    extend: {
      fontFamily: {
        condensed: ["DM Sans", "sans-serif"],
        sans: ["DM Sans", "sans-serif"],
        serif: ["Bitter", "serif"],
        icon: ['"Font Awesome 6 Pro"'],
      },
      colors: {
        ...defaultTheme.colors,
        ...colors,
      },
      content: {
        "chevron-right": '"\\f054"',
      },
      backgroundImage: {
        divider: `linear-gradient(90deg, ${colors["red"]} 0%, ${colors["red"]} 33.33%, ${colors["yellow"]} 33.33%, ${colors["yellow"]} 66.66%, ${colors["black"]} 66.66%, ${colors["black"]} 100%)`,
      },
      aria: {
        "page-current": 'current="page"',
      },
      animation: {
        fade: "fade 250ms ease-in-out 1 both",
      },
      keyframes: {
        fade: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      spacing: {
        "max-content": "1320px",
      },
      borderWidth: {
        "1rem": "1rem",
      },
    },
  },
  plugins: [require("@headlessui/tailwindcss")],
  corePlugins: {
    preflight: true,
  },
  safelist: ["vcard", "author"],
  important: true,
};
