import { getCustomFooterByTagsOrUnits } from "@/data/drupal/custom-footer";
import { tv } from "tailwind-variants";
import { Container } from "@uoguelph/react-components/container";

export type CustomFooterProps = {
  tags?: string[];
  units?: string[];
};

export async function CustomFooter({ tags, units }: CustomFooterProps) {
  const content = await getCustomFooterByTagsOrUnits(tags ?? [], units ?? []);
  console.log(content);

  if (!content) {
    return <></>;
  }

  const classes = tv({
    slots: {
      base: "w-full py-5 bg-grey-light-bg",
    },
  })();

  return <div className={classes.base()}>
    <Container>
      <div>{content.title}</div>
    </Container>
  </div>;
}
