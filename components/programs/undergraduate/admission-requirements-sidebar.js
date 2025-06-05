import { Button as ButtonWidget } from "@/components/widgets/button-section";
import { Heading } from "@/components/heading";

export const AdmissionRequirementsSidebar = ({ data = [] }) => {
  return (
    <>
      <Heading level={3} as="h2" className="mt-7">
        More Information
      </Heading>

      <ul className="flex flex-col w-full gap-4 !list-none">
        {data.map((button, index) => (
          <li key={button.id} className="w-full">
            <ButtonWidget column="Secondary" data={button} />
          </li>
        ))}
      </ul>
    </>
  );
};
