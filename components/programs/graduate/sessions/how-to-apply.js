import React from "react";
import { Heading } from "@/components/heading";
import { Link } from "@/components/link";
import { Accordion } from "@/components/accordion";

export const HowToApply = ({ data }) => {
  return (
    <div className="mx-auto mt-4 md:flex gap-8">
      <div className="md:w-3/4">
        <Heading className="text-red" level={2}>
          How To Apply to Biostatistics
        </Heading>
        <p>
          To apply, you must &nbsp;
          <Link href="#">secure a faculty advisor</Link>. Email your chosen advisor to discuss research opportunities.
        </p>
        <div className="accordion-div">
          <Accordion title="Admission Requirements - MSc">Admission Requirements - MSc content...</Accordion>
          <Accordion title="Admission Requirements - PhD">Admission Requirements - PhD content...</Accordion>
          <Accordion title="Application Deadlines">Application Deadlines - PhD content...</Accordion>
          <Accordion title="Helpful Tips for Your Application">Helpful Tips for Your Application content...</Accordion>
        </div>
        <p>
          You may also be interested in &nbsp;
          <Link href="#">Biostatistics (Course-based)</Link>
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
            <Link href="mailto:harwood@uoguelph.ca">harwood@uoguelph.ca</Link>
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
            <Link href="mailto:lewest@uoguelph.ca">lewest@uoguelph.ca</Link>
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
