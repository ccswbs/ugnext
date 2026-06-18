import { AadContactInfo } from "./aad-contact-info";

interface AadContactInfoWrapperProps {
  email?: string;
  directoryEmail: boolean;
  directoryOffice: boolean;
  directoryPhone: boolean;
  className?: string;
}

export async function AadContactInfoWrapper(props: AadContactInfoWrapperProps) {
  return <AadContactInfo {...props} />;
}