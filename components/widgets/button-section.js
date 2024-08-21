import { Button } from '@/components/widgets/button-widget';

export const ButtonSection = ({ data }) => {
  const buttons = data?.buttons;
  const column = data?.sectionColumn?.name;

  return (
    <>{buttons?.length > 0 && buttons.map((button) => <Button key={button.id} column={column} data={button} />)}</>
  );
};
