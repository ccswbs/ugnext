import React from 'react';
import { Heading } from '@/components/heading';
import { SpotlightCards } from '@/components/home/spotlight-cards';

export const CollaborativeSpecializations = ({ data }) => {
  //const cards = data.spot_light_cards;
  // use test data for cards
  const cards = [
    {
      id: '8d523c34-459b-423e-a0b7-dcea4b8bae09',
      image: {
        image: {
          alt: 'Neuroscience',
          height: 456,
          width: 462,
          variations: [
            {
              url: 'https://placehold.co/462x456/png',
            },
          ],
        },
      },
      rank: 2,
      title: 'Neuroscience',
      thumbnailImageCrop: 'right',
      url: {
        url: '/#',
        title: 'Neuroscience',
      },
    },
    {
      id: 'da911121-2314-4fe0-abdc-26e7c6d940c8',
      image: {
        image: {
          alt: 'Regenerative',
          height: 456,
          width: 462,
          variations: [
            {
              url: 'https://placehold.co/462x456/png',
            },
          ],
        },
      },
      rank: 3,
      title: 'Regenerative',
      thumbnailImageCrop: 'center',
      url: {
        url: '#',
        title: 'Regenerative',
      },
    },
    {
      id: 'b14cec10-2e03-450a-ae2e-6f6b25ebf056',
      image: {
        image: {
          alt: 'One Health',
          height: 456,
          width: 462,
          variations: [
            {
              url: 'https://placehold.co/462x456/png',
            },
          ],
        },
      },
      rank: 4,
      title: 'One Health',
      thumbnailImageCrop: 'center',
      url: {
        url: '#',
        title: 'One Health',
      },
    },
    {
      id: 'cafb4191-a0f3-48db-9e93-21650f3dd6ee',
      image: {
        image: {
          alt: 'Toxicology',
          height: 456,
          width: 462,
          variations: [
            {
              url: 'https://placehold.co/462x456/png',
            },
          ],
        },
      },
      rank: 5,
      title: 'Toxicology',
      thumbnailImageCrop: 'right',
      url: {
        url: '#',
        title: 'Toxicology',
      },
    },
  ];

  return (
    <div>
      <Heading className="text-red" level={2}>
        Collaborative Specializations
      </Heading>
      <p>
        While enrolled in the Biostatistics program, take one of the following collaborative specializations, earning
        you valuable multidisciplinary experience.
      </p>
      <SpotlightCards cards={cards} />
    </div>
  );
};
