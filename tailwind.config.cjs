/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

const colors = {
  "uog-black": "#000",
  "uog-black-bg": "#000",
  "uog-black-contrast": "#fff",
  "uog-black-focus": "#444",
  "uog-black-on-light": "#000",

  "uog-blue": "#187bb4",
  "uog-blue-contrast": "#fff",
  "uog-blue-focus": "#135f8b",
  "uog-blue-on-light": "#1775ab",

  "uog-body-copy": "#555",
  "uog-body-copy-on-dark": "#ccc",
  "uog-body-copy-bold": "#333",
  "uog-body-copy-bold-on-dark": "#eee",
  "uog-body-copy-link": "#187bb4",
  "uog-body-copy-link-on-light": "#166ea2",
  "uog-body-copy-link-on-dark": "#1d93d7",

  "uog-green": "#318738",
  "uog-green-contrast": "#fff",
  "uog-green-focus": "#27682c",
  "uog-green-on-light": "#2e7f35",

  "uog-grey-dark": "#747676",
  "uog-grey-dark-bg": "#222222",
  "uog-grey-dark-contrast": "#fff",
  "uog-grey-dark-focus": "#63625f",
  "uog-grey-dark-on-light": "#686764",

  "uog-grey-light": "#d8d8d8",
  "uog-grey-light-bg": "#f5f5f5",
  "uog-grey-light-contrast": "#000",
  "uog-grey-light-focus": "#bfbfbf",
  /* "uog-grey-light-on-dark": "TBD", */

  "uog-red": "#e51937",
  "uog-red-contrast": "#fff",
  "uog-red-focus": "#b3142c",
  "uog-red-on-light": "#dc1836",

  "uog-yellow": "#ffc429",
  "uog-yellow-contrast": "#000",
  "uog-yellow-focus": "#ffe299",
  "uog-yellow-on-dark": "#ffc429",

  "uog-white": "#fff",
  "uog-white-bg": "#fff",
  "uog-white-contrast": "#000",
  "uog-white-focus": "#ddd",
  "uog-white-on-dark": "#fff",

  /* legacy */
  "uog-blue-muted": "#f5f7fa",
  "uog-blue-muted-contrast": "#000",

  "green": "#318738",
  "blue": "#187bb4",
  "white": "#ffffff",
  "off-white": "#eeeeee",
  "light-grey": "#dadcd4",
  "dark-grey": "#787673",
  "grey": "#555555",
  "charcoal": "#333333",
  "black": "#000000",
  "warning": "#d43900",
  "danger": "#e51937",
  "twitter": "#1da1f3",
  "facebook": "#4267b2",
  "instagram": "#e53c7e",
  "linkedin": "#0077b5",
  "youtube": "#ff0200",
};

const scaled = (input, scale) => {
  if (input == null) {
    return input;
  }

  switch (typeof input) {
    case "object":
      if (Array.isArray(input)) {
        return input.map((val) => scaled(val, scale));
      } else {
        const ret = {};
        for (const key in input) {
          ret[key] = scaled(input[key], scale);
        }
        return ret;
      }
    case "string":
      return input.replace(/(\d*\.?\d+)rem$/, (_, val) => parseFloat((parseFloat(val) * scale).toFixed(4)) + "rem");
    default:
      return input;
  }
};

const scale = 1 / 0.625;

module.exports = {
  content: [
    "./components/**/*.{html,js,jsx,ts,tsx}",
    "./pages/**/*.{html,js,jsx,ts,tsx}",
    "./public/**/*.{html,js,jsx,ts,tsx}",
    "./stories/**/*.{html,js,jsx,ts,tsx}",
  ],
  darkMode: "selector",
  theme: {
    borderRadius: scaled(defaultTheme.borderRadius, scale),
    columns: scaled(defaultTheme.columns, scale),
    fontSize: scaled(defaultTheme.fontSize, scale),
    lineHeight: scaled(defaultTheme.lineHeight, scale),
    maxWidth: ({ theme, breakpoints }) => ({
      ...scaled(defaultTheme.maxWidth({ theme, breakpoints }), scale),
    }),
    maxHeight: ({ theme, breakpoints }) => ({
      ...scaled(defaultTheme.maxHeight({ theme, breakpoints }), scale),
    }),
    spacing: scaled(defaultTheme.spacing, scale),
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
        divider: `linear-gradient(90deg,#000 0%,#000 33%,${colors['uog-red']} 0,${colors['uog-red']} 66%,${colors['uog-yellow']} 0,${colors['uog-yellow']} 90%)`,
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
