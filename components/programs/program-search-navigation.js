import { Navigation } from "@/components/navigation";

export const ProgramSearchNavigation = () => {
  return (
    <Navigation
      label="Level of Study"
      links={[
        { href: "/programs/undergraduate", label: "Undergraduate Programs" },
        { href: "/programs/graduate", label: "Graduate Programs" },
        { href: "/programs/certificate-and-diploma", label: "Certificate and Diplomas" },
        { href: "/programs/continuing-education", label: "Continuing Education" },
      ]}
    />
  );
};
