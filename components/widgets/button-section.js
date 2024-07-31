import { createContext } from 'react';
import { twJoin } from 'tailwind-merge';
import { Button } from '@/components/widgets/button-widget';

export const ButtonSection = ({ data }) => {
  const buttonsData = data?.buttons;
  const buttonCol = data?.sectionColumn;

  console.log(buttonsData);
  console.log(buttonCol);

  return (
    <>
      {buttonsData?.length > 0 && (
        <>
          {buttonsData.map((button, index) => (
            <Button key={index} buttonData={button} buttonCol={buttonCol} />
          ))}
        </>
      )}
    </>
  );
};
