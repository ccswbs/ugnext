import { Layout, LayoutContent } from "@uoguelph/react-components/layout";
import { Footer } from "@uoguelph/react-components/footer";
import { Header } from "@/components/server/header";
import { getProfileContent } from "@/data/drupal/profile";
import { HtmlParser } from "@/components/client/html-parser";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/server/breadcrumbs";
//import Image from "next/image";
import { Container } from "@uoguelph/react-components/container";
import { Typography } from "@uoguelph/react-components/typography";
//import { WidgetSelector } from "@/components/client/widgets/widget-selector";

export type ProfileProps = {
  id: string;
  pre?: React.ReactNode;
  post?: React.ReactNode;
};

type ProfileContent = NonNullable<Awaited<ReturnType<typeof getProfileContent>>>;

export async function Profile({ id, pre, post }: ProfileProps) {
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
        <Breadcrumbs url={content.path ?? undefined} />
        <Container>
        <Typography type="h1" as="h1">
          {content?.title}
        </Typography>      
        {pre && pre}
        {content.profilePicture && (
          <img
            alt={content.profilePicture.image.alt ?? ""}
          height={content.profilePicture.image.height}
          width={content.profilePicture.image.width}
          src={content.profilePicture.image.url}
          />
        )}        
        <HtmlParser key="profile-body" html={content.body.processed} />
        {content?.profileSections?.map((section, index) => (
          <div key={index}>
            <Typography type="h2" as="h2">
              {section.profilePartLabel}
            </Typography>
            <HtmlParser key={section.id} html={section.profilePartText.processed } />
          </div>
        ))}

        {post && post}
        </Container>        
      </LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}
