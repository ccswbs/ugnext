import { Alert } from '@/components/alert';

const config = {
  title: 'Components/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
    docs: {
      toc: true,
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: { control: false },
    subtitle: { control: false },
    message: { control: false },
    footer: { control: false },
  },
};

export default config;

export const Danger = {
  args: {
    title: 'Example Title',
    type: 'danger',
    subtitle: 'Example Subtitle',
    message:
      'Example message. Iusto possimus possimus delectus et. Et aspernatur culpa quis sint at nam voluptatibus. Occaecati perspiciatis ea eius dolorem aliquid. Ad ducimus aut aspernatur. Cumque enim repellat reprehenderit. Similique perspiciatis alias doloremque reprehenderit eum. A laboriosam dolore. Facere possimus qui. Voluptas quas dicta hic adipisci voluptatibus impedit consectetur quae veniam. Totam amet magni. Vero voluptas dolorum itaque praesentium sint quasi accusamus. Culpa consequuntur doloribus sint. Pariatur sequi consequuntur quidem enim exercitationem. Culpa repellendus eveniet fugit cum. Sapiente doloribus recusandae ex autem.',
    footer: 'Example Footer',
  },
};

export const Warning = {
  args: {
    title: 'Example Title',
    type: 'warning',
    subtitle: 'Example Subtitle',
    message:
      'Example message. Iusto possimus possimus delectus et. Et aspernatur culpa quis sint at nam voluptatibus. Occaecati perspiciatis ea eius dolorem aliquid. Ad ducimus aut aspernatur. Cumque enim repellat reprehenderit. Similique perspiciatis alias doloremque reprehenderit eum. A laboriosam dolore. Facere possimus qui. Voluptas quas dicta hic adipisci voluptatibus impedit consectetur quae veniam. Totam amet magni. Vero voluptas dolorum itaque praesentium sint quasi accusamus. Culpa consequuntur doloribus sint. Pariatur sequi consequuntur quidem enim exercitationem. Culpa repellendus eveniet fugit cum. Sapiente doloribus recusandae ex autem.',
    footer: 'Example Footer',
  },
};

export const Info = {
  args: {
    title: 'Example Title',
    type: 'info',
    subtitle: 'Example Subtitle',
    message:
      'Example message. Iusto possimus possimus delectus et. Et aspernatur culpa quis sint at nam voluptatibus. Occaecati perspiciatis ea eius dolorem aliquid. Ad ducimus aut aspernatur. Cumque enim repellat reprehenderit. Similique perspiciatis alias doloremque reprehenderit eum. A laboriosam dolore. Facere possimus qui. Voluptas quas dicta hic adipisci voluptatibus impedit consectetur quae veniam. Totam amet magni. Vero voluptas dolorum itaque praesentium sint quasi accusamus. Culpa consequuntur doloribus sint. Pariatur sequi consequuntur quidem enim exercitationem. Culpa repellendus eveniet fugit cum. Sapiente doloribus recusandae ex autem.',
    footer: 'Example Footer',
  },
};

export const NoFooter = {
  args: {
    title: 'Example Title',
    type: 'danger',
    subtitle: 'Example Subtitle',
    message:
      'Example message. Iusto possimus possimus delectus et. Et aspernatur culpa quis sint at nam voluptatibus. Occaecati perspiciatis ea eius dolorem aliquid. Ad ducimus aut aspernatur. Cumque enim repellat reprehenderit. Similique perspiciatis alias doloremque reprehenderit eum. A laboriosam dolore. Facere possimus qui. Voluptas quas dicta hic adipisci voluptatibus impedit consectetur quae veniam. Totam amet magni. Vero voluptas dolorum itaque praesentium sint quasi accusamus. Culpa consequuntur doloribus sint. Pariatur sequi consequuntur quidem enim exercitationem. Culpa repellendus eveniet fugit cum. Sapiente doloribus recusandae ex autem.',
  },
};
