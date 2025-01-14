import React from "react";
import { Heading } from "@/components/heading";
import { Columns } from "@/components/columns";

export const FundYourEducation = () => {
  return (
    <div>
      <Heading className="text-red" level={2}>
        How To Fun Your Education
      </Heading>
      <Columns cols={3} className="pt-2">
        <div className="bg-uog-blue-muted border-l-1rem border-red-700 border-solid px-4">
          <Heading level={3} className="text-xl mb-1 mt-1">
            Scholaships & Awards
          </Heading>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat.
          </p>
        </div>
        <div className="bg-uog-blue-muted border-l-1rem border-yellow-400 border-solid px-4">
          <Heading level={3} className="text-xl mb-1 mt-1">
            Financial Aid & Bursaries
          </Heading>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat.
          </p>
        </div>
        <div className="bg-uog-blue-muted border-l-1rem border-light-blue-400 border-solid px-4">
          <Heading level={3} className="text-xl mb-1 mt-1">
            Cost Of Tuition & Living
          </Heading>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat.
          </p>
        </div>
      </Columns>
    </div>
  );
};
