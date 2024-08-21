import React from 'react';
import { Heading } from '@/components/heading';
import { Link } from '@/components/link';
import { Accordion } from '@/components/accordion';

export const HowToApply = ({ data }) => {
  return (
    <div className="mx-auto mt-4 md:flex gap-8">
      <div className="md:w-3/4">
        <Heading className="text-red" level={2}>
          How To Apply to Biostatistics
        </Heading>
        <p>
          To apply, you must &nbsp;
          <Link children="secure a faculty advisor" href="#" />. Email your chosen advisor to discuss research
          opportunities.
        </p>
        <div className="accordion-div">
          <Accordion title="Admission Requirements - MSc" children="Admission Requirements - MSc content..." />
          <Accordion title="Admission Requirements - PhD" children="Admission Requirements - PhD content..." />
          <Accordion title="Application Deadlines" children="Application Deadlines - PhD content..." />
          <Accordion
            title="Helpful Tips for Your Application"
            children="Helpful Tips for Your Application content..."
          />
        </div>
        <p>
          You may also be interested in &nbsp;
          <Link children="Biostatistics (Course-based)" href="#" />
        </p>
      </div>
      <div className="md:w-1/4">
        <Heading className="text-red" level={2}>
          Have Questions?
        </Heading>
        <div>
          <Heading className="text-lg mb-1 mt-1" level={3}>
            Applying & Admission
          </Heading>
          <p>
            <i className="fa-regular fa-address-card mr-2"></i>
            Jake Harwood
          </p>
          <p>
            <i className="fa-solid fa-at mr-2"></i>
            <Link children="harwood@uoguelph.ca" href="mailto:harwood@uoguelph.ca" />
          </p>
          <p>
            <i className="fa-solid fa-phone mr-2"></i>
            519-824-4120, Ext. 56215
          </p>
        </div>
        <div>
          <br></br>
        </div>
        <div>
          <Heading className="text-lg mb-1 mt-1" level={3}>
            Graduate Program Options
          </Heading>
          <p>
            <i className="fa-regular fa-address-card mr-2"></i>
            Leigh West
          </p>
          <p>
            <i className="fa-solid fa-at mr-2"></i>
            <Link children="lewest@uoguelph.ca" href="mailto:lewest@uoguelph.ca" />
          </p>
          <p>
            <i className="fa-solid fa-phone mr-2"></i>
            519-824-4120, Ext. 52101
          </p>
        </div>
      </div>
    </div>
  );
};
