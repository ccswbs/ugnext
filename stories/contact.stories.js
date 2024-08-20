import { Contact } from '@/components/contact';

const config = {
  title: 'Components/Contact',
  component: Contact,
  parameters: {
    layout: 'centered',
    docs: {
      toc: true,
    },
  },
  tags: ['autodocs'],
};

export default config;

export const Default = {
  args: {
    name: 'Example Name',
    title: 'Example Title',
    phoneNumber: '123-456-7890',
    extension: '12345',
    email: 'example@example.com',
  },
};
