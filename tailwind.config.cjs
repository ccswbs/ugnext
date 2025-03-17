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
  
  "uog-color-light-grey": "#d8d8d8",
  "uog-color-light-grey-focus": "#bfbfbf",
  "uog-color-light-grey-contrast": "#000",
  "uog-color-light-grey-bg": "#f5f5f5",
  
  "uog-color-dark-grey": "#747676",
  "uog-color-dark-grey-focus": "#63625f",
  "uog-color-dark-grey-contrast": "#fff",
  "uog-color-dark-grey-bg": "#222",
  
  "uog-color-body-copy": "#555",
  "uog-color-body-copy-on-light": "#555",
  "uog-color-body-copy-on-dark": "#ccc",
  
  "uog-color-body-copy-bold": "#333",
  "uog-color-body-copy-bold-on-light": "#000",
  "uog-color-body-copy-bold-on-dark": "#e2e2e2",
  
  "uog-color-body-copy-link": "#187bb4",
  "uog-color-body-copy-link-on-light": "#166ea2",
  "uog-color-body-copy-link-on-dark": "#1d93d7"
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
        divider: `linear-gradient(90deg, ${colors['uog-red']} 0%, ${colors['uog-red']} 33.33%, ${colors['uog-yellow']} 33.33%, ${colors['uog-yellow']} 66.66%, ${colors['uog-black']} 66.66%, ${colors['uog-black']} 100%)`,
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
