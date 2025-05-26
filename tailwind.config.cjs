/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

const colors = {
  "uog-color-white": "#fff",
  "uog-color-white-focus": "#ddd",
  "uog-color-white-on-dark": "#fff",
  "uog-color-white-contrast": "#000",

  "uog-color-black": "#000",
  "uog-color-black-focus": "#444",
  "uog-color-black-on-light": "#000",
  "uog-color-black-contrast": "#fff",

  "uog-color-red": "#e51937",
  "uog-color-red-focus": "#b3142c",
  "uog-color-red-on-light": "#dc1836",
  "uog-color-red-contrast": "#fff",

  "uog-color-yellow": "#ffc429",
  "uog-color-yellow-focus": "#ffe299",
  "uog-color-yellow-on-dark": "#ffc429",
  "uog-color-yellow-contrast": "#000",

  "uog-color-blue": "#187bb4",
  "uog-color-blue-focus": "#135f8b",
  "uog-color-blue-on-light": "#1775ab",
  "uog-color-blue-contrast": "#fff",

  "uog-color-green": "#318738",
  "uog-color-green-focus": "#27682c",
  "uog-color-green-on-light": "#2e7f35",
  "uog-color-green-contrast": "#fff",

  "uog-color-grey-light": "#d8d8d8",
  "uog-color-grey-light-focus": "#bfbfbf",
  "uog-color-grey-light-contrast": "#000",
  "uog-color-grey-light-bg": "#f5f5f5",

  "uog-color-grey-dark": "#747676",
  "uog-color-grey-dark-focus": "#63625f",
  "uog-color-grey-dark-contrast": "#fff",
  "uog-color-grey-dark-bg": "#222",

  "uog-color-body-copy": "#555",
  "uog-color-body-copy-on-light": "#555",
  "uog-color-body-copy-on-dark": "#ccc",

  "uog-color-body-copy-bold": "#333",
  "uog-color-body-copy-bold-on-light": "#333",
  "uog-color-body-copy-bold-on-dark": "#e2e2e2",

  "uog-color-body-copy-link": "#187bb4",
  "uog-color-body-copy-link-on-light": "#166ea2",
  "uog-color-body-copy-link-on-dark": "#1d93d7",

  "facebook-color-blue": "#0866ff",
  "instagram-color-pink": "#d62976",
  "linkedin-color-blue": "#0a66c2",
  "youtube-color-red": "#ff0000",
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
        divider: `linear-gradient(90deg, ${colors["uog-color-red"]} 0%, ${colors["uog-color-red"]} 33.33%, ${colors["uog-color-yellow"]} 33.33%, ${colors["uog-color-yellow"]} 66.66%, ${colors["uog-color-black"]} 66.66%, ${colors["uog-color-black"]} 100%)`,
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
