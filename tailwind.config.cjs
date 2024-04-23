/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');
const defaultTheme = require('tailwindcss/defaultTheme');
const scaled = (input, scale) => {
	if (input == null) {
		return input;
	}

	switch (typeof input) {
		case 'object':
			if (Array.isArray(input)) {
				return input.map((val) => scaled(val, scale));
			} else {
				const ret = {};
				for (const key in input) {
					ret[key] = scaled(input[key], scale);
				}
				return ret;
			}
		case 'string':
			return input.replace(/(\d*\.?\d+)rem$/, (_, val) => parseFloat((parseFloat(val) * scale).toFixed(4)) + 'rem');
		default:
			return input;
	}
};

const scale = 1 / 0.625;

module.exports = {
	content: [
		'./components/**/*.{html,js,jsx,ts,tsx}',
		'./pages/**/*.{html,js,jsx,ts,tsx}',
		'./public/**/*.{html,js,jsx,ts,tsx}',
	],
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
				condensed: ['Roboto Condensed', 'Arial', 'sans-serif'],
				sans: ['Roboto', 'Arial', 'sans-serif'],
			},
			colors: {
				red: {
					50: '#fff0f1',
					100: '#ffe2e4',
					200: '#ffc9cf',
					300: '#ff9da9',
					400: '#ff667b',
					500: '#ff3051',
					600: '#f10d3c',
					700: '#c20430',
					800: '#aa0732',
					900: '#910a31',
					950: '#520016',
					DEFAULT: '#c20430',
				},
				yellow: {
					50: '#fffbeb',
					100: '#fff5c6',
					200: '#ffe988',
					300: '#ffd84a',
					400: '#ffc72a',
					500: '#f9a307',
					600: '#dd7b02',
					700: '#b75606',
					800: '#94410c',
					900: '#7a360d',
					950: '#461b02',
					DEFAULT: '#ffc72a',
				},
				blue: {
					50: '#f1f8fa',
					100: '#ddecf0',
					200: '#bedae3',
					300: '#91bfcf',
					400: '#69a3b9',
					500: '#417f99',
					600: '#396981',
					700: '#33576b',
					800: '#314a59',
					900: '#2c3f4d',
					950: '#192833',
					DEFAULT: '#69a3b9',
				},
				green: {
					50: '#f1fbea',
					100: '#def5d2',
					200: '#c1ebab',
					300: '#99dd79',
					400: '#77cb50',
					500: '#57b131',
					600: '#3c8221',
					700: '#336c1f',
					800: '#2c561e',
					900: '#28491e',
					950: '#11280b',
					DEFAULT: '#3c8221',
				},
				grey: {
					50: '#f8f8f8',
					100: '#f0f0f0',
					200: '#dddddd',
					300: '#d1d1d1',
					400: '#b4b4b4',
					500: '#9a9a9a',
					600: '#818181',
					700: '#6a6a6a',
					800: '#5a5a5a',
					900: '#4e4e4e',
					950: '#282828',
					DEFAULT: '#dddddd',
				},
			},
			width: {
				'sm-container': '540px',
				'md-container': '720px',
				'lg-container': '960px',
				'xl-container': '1140px',
				'xxl-container': '1320px',
			},
			maxWidth: {
				'sm-container': '540px',
				'md-container': '720px',
				'lg-container': '960px',
				'xl-container': '1140px',
				'xxl-container': '1320px',
			},
		},
	},
	plugins: [
		plugin(function ({ addBase }) {
			addBase({
				html: { fontSize: '10px' },
			});
		}),
	],
	corePlugins: {
		preflight: true,
	},
	important: false,
};
