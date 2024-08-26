import { Info } from '@/components/info';

const config = {
  title: 'Components/Info',
  component: Info,
  parameters: {
    layout: 'centered',
    docs: {
      toc: true,
    },
  },
  tags: ['autodocs'],
};

export default config;

export const Red = {
  args: {
    children: (
      <span>
        Eos optio aut officia maiores. Corrupti voluptate earum sit aperiam fugiat sit. Excepturi perspiciatis eligendi
        tempore est beatae ullam minus. Tempore perferendis eos magnam quo temporibus occaecati. A nihil ratione officia
        vel.
      </span>
    ),
    color: 'red',
  },
};

export const Yellow = {
  args: {
    children: (
      <span>
        Eos optio aut officia maiores. Corrupti voluptate earum sit aperiam fugiat sit. Excepturi perspiciatis eligendi
        tempore est beatae ullam minus. Tempore perferendis eos magnam quo temporibus occaecati. A nihil ratione officia
        vel.
      </span>
    ),
    color: 'yellow',
  },
};

export const Blue = {
  args: {
    children: (
      <span>
        Eos optio aut officia maiores. Corrupti voluptate earum sit aperiam fugiat sit. Excepturi perspiciatis eligendi
        tempore est beatae ullam minus. Tempore perferendis eos magnam quo temporibus occaecati. A nihil ratione officia
        vel.
      </span>
    ),
    color: 'blue',
  },
};
