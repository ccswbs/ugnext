/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

const colors = {
  red: {
    50: "#fff0f1",
    100: "#ffe2e4",
    200: "#ffc9cf",
    300: "#ff9da9",
    400: "#ff667b",
    500: "#ff3051",
    600: "#f10d3c",
    700: "#c20430",
    800: "#aa0732",
    900: "#910a31",
    950: "#520016",
    DEFAULT: "#c20430",
  },
  yellow: {
    50: "#fffbeb",
    100: "#fff5c6",
    200: "#ffe988",
    300: "#ffd84a",
    400: "#ffc72a",
    500: "#f9a307",
    600: "#dd7b02",
    700: "#b75606",
    800: "#94410c",
    900: "#7a360d",
    950: "#461b02",
    DEFAULT: "#ffc72a",
  },
  blue: {
    50: "#f0f8ff",
    100: "#e0f0fe",
    200: "#b9e2fe",
    300: "#7ccbfd",
    400: "#36b2fa",
    500: "#0c99eb",
    600: "#0074c1",
    700: "#015fa3",
    800: "#065186",
    900: "#0b446f",
    950: "#072b4a",
    DEFAULT: "#0074c1",
  },
  "light-blue": {
    50: "#f1f8fa",
    100: "#ddecf0",
    200: "#bedae3",
    300: "#91bfcf",
    400: "#69a3b9",
    500: "#417f99",
    600: "#396981",
    700: "#33576b",
    800: "#314a59",
    900: "#2c3f4d",
    950: "#192833",
    DEFAULT: "#69a3b9",
  },
  green: {
    50: "#f1fbea",
    100: "#def5d2",
    200: "#c1ebab",
    300: "#99dd79",
    400: "#77cb50",
    500: "#57b131",
    600: "#3c8221",
    700: "#336c1f",
    800: "#2c561e",
    900: "#28491e",
    950: "#11280b",
    DEFAULT: "#3c8221",
  },
  gray: {
    50: "#f8f8f8",
    100: "#f0f0f0",
    200: "#dddddd",
    300: "#d1d1d1",
    400: "#b4b4b4",
    500: "#9a9a9a",
    600: "#818181",
    700: "#6a6a6a",
    800: "#5a5a5a",
    900: "#4e4e4e",
    950: "#282828",
    DEFAULT: "#dddddd",
    light: "#f5f5f5",
  },
  "cool-gray": {
    50: "#f4f6f7",
    100: "#e3e7ea",
    200: "#cbd3d6",
    300: "#a6b4ba",
    400: "#7a8c96",
    500: "#5f717b",
    600: "#515f69",
    700: "#465058",
    800: "#3e454c",
    900: "#373d42",
    950: "#212529",
  },
  "uog-blue-muted": {
    DEFAULT: "#f5f7fa",
  },
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
        condensed: ["Roboto Condensed", "Arial", "sans-serif"],
        sans: ["Roboto", "Arial", "sans-serif"],
        icon: ['"Font Awesome 6 Pro"'],
      },
      colors: colors,
      content: {
        "chevron-right": '"\\f054"',
      },
      backgroundImage: {
        divider: `linear-gradient(90deg,#000 0%,#000 33%,hsla(0,0%,100%,0) 0,hsla(0,0%,100%,0) 34%,${colors.red.DEFAULT} 0,${colors.red.DEFAULT} 66%,hsla(0,0%,100%,0) 0,hsla(0,0%,100%,0) 67%,${colors.yellow.DEFAULT} 0,${colors.yellow.DEFAULT} 90%)`,
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
