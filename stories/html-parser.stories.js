import { HtmlParser } from '@/components/html-parser';
import { Divider } from '@/components/divider';

const config = {
  title: 'Components/HtmlParser',
  component: HtmlParser,
  parameters: {
    layout: 'padded',
    docs: {
      toc: true,
    },
  },
  tags: ['autodocs'],
  argTypes: {
    instructions: { control: false },
  },
};

export default config;

export const Default = {
  args: {
    html: '<strong>Lorem Ipsum</strong>',
  },
};

export const WithCustomInstructions = {
  args: {
    html: '<strong>Lorem Ipsum</strong>',
    instructions: [
      {
        shouldProcessNode: (node) => node.tagName === 'strong',
        processNode: (node, children) => <span className="font-black text-red">{children}</span>,
      },
    ],
  },
  parameters: {
    docs: {
      source: {
        code:
          '<HtmlParser\n' +
          '  html="<strong>Lorem Ipsum</strong>"\n' +
          '  instructions={[\n' +
          '    {\n' +
          '      shouldProcessNode: (node) => node.tagName === "strong",\n' +
          '      processNode: (node, children) => (\n' +
          '        <span className="font-black text-red">{children}</span>\n' +
          '      )\n' +
          '    }\n' +
          '  ]}\n' +
          '/>',
      },
    },
  },
};
