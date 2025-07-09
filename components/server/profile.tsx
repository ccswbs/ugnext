import { Layout, LayoutContent } from "@uoguelph/react-components/layout";
import { Footer } from "@uoguelph/react-components/footer";
import { Header } from "@/components/server/header";
import { getProfileContent } from "@/data/drupal/profile";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/server/breadcrumbs";
import { Hero, HeroTitle, HeroVideo } from "@uoguelph/react-components/hero";
import Image from "next/image";
import { Container } from "@uoguelph/react-components/container";
import { Typography } from "@uoguelph/react-components/typography";
//import { WidgetSelector } from "@/components/client/widgets/widget-selector";

export type ProfileProps = {
  id: string;
};

type ProfileContent = NonNullable<Awaited<ReturnType<typeof getProfileContent>>>;

function PageHero({ content }: { content: NonNullable<ProfileContent> }) {
  if (content.image) {
    return (
      <>
        <Hero
          alt={content.image.image.alt ?? ""}
          height={content.image.image.height}
          width={content.image.image.width}
          src={content.image.image.url}
          variant="basic"
          priority
          as={Image}
        >
          <HeroTitle>{content.title}</HeroTitle>
          {content.heroWidgets?.video && (
            <HeroVideo
              src={content.heroWidgets.video.url}
              title={content.heroWidgets.video.name}
              transcript={content.heroWidgets.video.transcript?.url}
            />
          )}
        </Hero>

        <Breadcrumbs url={content.path ?? undefined} />
      </>
    );
  }

  return (
    <>
      <Breadcrumbs url={content.path ?? undefined} />

      <Container>
        <Typography type="h1" as="h1">
          {content?.title}
        </Typography>
      </Container>
    </>
  );
}

export async function Profile({ id }: ProfileProps) {
  const content = await getProfileContent(id);

  // Couldn't fetch content for this id.
  if (!content) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`Couldn't find content for profile with id ${id}`);

      if (process.env.ALWAYS_SHOW_PUBLISHED_CONTENT) {
        console.warn("It's possible this profile is not published. ALWAYS_SHOW_PUBLISHED_CONTENT is set to true.");
      }
    }

    notFound();
  }

  return (
    <Layout>
      <Header name={content.primaryNavigation?.menuName?.toUpperCase().replaceAll("-", "_")}></Header>

      <LayoutContent container={false}>
        <PageHero content={content} />

        <p>Profile content is supposed to be here.</p>
      </LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}
