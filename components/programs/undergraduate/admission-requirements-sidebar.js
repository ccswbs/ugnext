import { Typography } from "@uoguelph/react-components/typography";
import { ButtonWidget } from "@/components/widgets/button-section";

export const AdmissionRequirementsSidebar = ({ data = [] }) => {
  return (
    <>
      <Typography type="h3" as="h2" className="mt-7">
        More Information
      </Typography>

      <ul className="flex flex-col w-full gap-4">
        {data.map((button, index) => (
          <li key={button.id} className="w-full">
            <ButtonWidget column="Secondary" data={button} />
          </li>
        ))}
      </ul>
    </>
  );
};
