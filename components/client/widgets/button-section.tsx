"use client";

import { tv } from "tailwind-variants";
import { Container } from "@uoguelph/react-components/container";
import type { ButtonSectionFragment } from "@/lib/graphql/types";
import { ButtonColumn, ButtonWidget } from "@/components/client/widgets/button";

export const ButtonSectionWidget = ({ data }: { data: ButtonSectionFragment }) => {
  const buttons = data.buttons ?? [];
  const column = (data?.buttonSectionColumn?.name?.toLowerCase()?.replaceAll(" ", "-") ?? "primary") as ButtonColumn;

  const classes = tv({
    base: "flex gap-2 pt-4",
    variants: {
      column: {
        primary: "flex flex-wrap px-0 mx-0",
        secondary: "flex-col px-0 mx-0",
        "call-to-action": "flex-wrap flex-row items-center justify-center",
      },
    },
  })({ column });

  return (
    <Container id={`button-section-${data.uuid}`} className={classes}>
      {buttons?.length > 0 && buttons.map((button) => <ButtonWidget key={button.id} column={column} data={button} />)}
    </Container>
  );
};
