import React from 'react';
import { Heading } from '@/components/heading';
import { Button } from '@/components/button';

export const ApplyNow = () => {
  return (
    <div className="text-center mx-auto py-5">
      <Heading level={3}>Are you ready to Improve Life?</Heading>
      <Button href="#" children="APPLY NOW" color="red" className="w-1/3 py-4 text-xl" />
    </div>
  );
};
