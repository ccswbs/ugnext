import { createContext } from 'react';
import { twJoin } from 'tailwind-merge';
import { Button } from '@/components/widgets/button-widget';
import ConditionalWrap from 'conditional-wrap';

export const ButtonSection = ({ data }) => {
  const buttonsData = data?.buttons;
  const buttonCol = data?.sectionColumn?.name;

  return (
    <>
      {buttonsData?.length > 0 && (
        <ConditionalWrap condition={buttonCol === 'Call to Action'} wrap={children => <div className='md:flex md:justify-center'>{children}</div>}>
          {buttonsData.map((button) => (            
              <Button key={button.id} buttonCol={buttonCol} buttonData={button} />            
          ))}
        </ConditionalWrap>
      )}
    </>
  );
};
