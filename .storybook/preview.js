import '@/styles/globals.css';
import { withThemeByClassName } from '@storybook/addon-themes';

console.log('test', typeof window === 'object');

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    storySort: {
      method: 'alphabetical',
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },

  decorators: [
    withThemeByClassName({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
  ],
};

export default preview;
