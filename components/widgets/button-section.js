import { createContext } from 'react';
import { twJoin } from 'tailwind-merge';
import { Button } from '@/components/widgets/button-widget';

export const ButtonSection = ({ data }) => {
  const buttonsData = data?.buttons;
  const buttonCol = data?.sectionColumn?.name;

  return (
    <>
      {buttonsData?.length > 0 && (
        <>
          {buttonsData.map((button, index) => (
            <Button key={index} buttonCol={buttonCol} buttonData={button} />
          ))}
        </>
      )}
    </>
  );
};
