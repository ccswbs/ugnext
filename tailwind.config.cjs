/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

const colors = {
  red: {
    '50': '#fff1f1',
    '100': '#ffe3e4',
    '200': '#ffccce',
    '300': '#ffa2a7',
    '400': '#fe6e79',
    '500': '#f83b4e',
    '600': '#e51937',
    '700': '#c20e2d',
    '800': '#a20f2d',
    '900': '#8a112d',
    '950': '#4d0413',
    DEFAULT: "#E51937",
  },
  yellow: {
    '50': '#fffbeb',
    '100': '#fff4c6',
    '200': '#ffe788',
    '300': '#ffd64a',
    '400': '#ffc429',
    '500': '#f9a007',
    '600': '#dd7802',
    '700': '#b75406',
    '800': '#943f0c',
    '900': '#7a340d',
    '950': '#461a02',
    DEFAULT: "#FFC429",
  },
  blue: {
    '50': '#f2f9fd',
    '100': '#e3f0fb',
    '200': '#c1e3f6',
    '300': '#8bcbee',
    '400': '#4db1e3',
    '500': '#2698d1',
    '600': '#187bb4',
    '700': '#146190',
    '800': '#155377',
    '900': '#174563',
    '950': '#0f2d42',
    DEFAULT: "#187BB4",
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
    '50': '#f3faf3',
    '100': '#e2f6e3',
    '200': '#c7ebc9',
    '300': '#9adb9f',
    '400': '#67c16e',
    '500': '#42a54a',
    '600': '#318738',
    '700': '#2a6b2f',
    '800': '#25562a',
    '900': '#204725',
    '950': '#0d2610',
    DEFAULT: "#318738",
  },
  gray: {
    '50': '#f6f5f5',
    '100': '#e7e6e6',
    '200': '#d1d0d0',
    '300': '#b2b1ae',
    '400': '#8a8886',
    '500': '#787673',
    '600': '#5f5e5b',
    '700': '#504f4e',
    '800': '#464544',
    '900': '#3d3c3c',
    '950': '#272725',
    DEFAULT: "#787673",
    light: "#DADCD4",
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
  "uog-color": {
    black: "#000000",
    "black-hover": "#353636",
    red: "#E51937",
    "red-hover": "#BD2E35",
    yellow: "#FFC429",
    "yellow-hover": "#FFE299",
    blue: "#187BB4",
    "blue-hover": "#156B9D",
    green: "#318738",
    "green-hover": "#2A7430",
    "light-gray": "#DADCD4",
    "light-gray-hover": "#BFBFBF",
    "dark-gray": "#787673",
    "dark-gray-hover": "#686764",
    DEFAULT: "#187BB4",
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
        "bitter": ["Bitter", "Arial", "sans-serif"],
        "dm-sans": ["DM Sans", "Arial", "sans-serif"],
        icon: ['"Font Awesome 6 Pro"'],
      },
      fontSize: {
        sm: ['1rem','1.4'],
        base: ['1.5rem','1.4'],
        xl: ['2rem','1.4'],
        'xl-s': ['2.5rem','1.4'],
        '2xl': ['2rem','1.4'],
        '3xl': ['3rem','1.4'],
        '4xl': ['4rem','1.4'],
      },
      colors: colors,
      content: {
        "chevron-right": '"\\f054"',
      },
      backgroundImage: {
        divider: `linear-gradient(90deg,#000,#000 56%,hsla(0,0%,100%,0) 0,hsla(0,0%,100%,0) 57%,${colors.red.DEFAULT} 0,${colors.red.DEFAULT} 85%,hsla(0,0%,100%,0) 0,hsla(0,0%,100%,0) 86%,${colors.yellow.DEFAULT} 0)`,
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
