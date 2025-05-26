import { Typography } from "@uoguelph/react-components/typography";
import { Container } from "@uoguelph/react-components/container";
import { Divider } from "@uoguelph/react-components/divider";

export const TagLine = () => (
  <Container className="flex flex-col py-4 items-center justify-center">
    <Typography type="h1" className="text-center!">
      University of Guelph, Ontario, Canada
    </Typography>

    <span className="mt-9 mb-6 text-center text-2xl">Improve Life</span>

    <Divider />
  </Container>
);
