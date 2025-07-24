import { Layout, LayoutContent } from "@uoguelph/react-components/layout";
import { Footer } from "@uoguelph/react-components/footer";
import { Header } from "@/components/server/header";
import { getProfileContent } from "@/data/drupal/profile";
import { HtmlParser } from "@/components/client/html-parser";
import { Link } from "@uoguelph/react-components/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/server/breadcrumbs";
import Image from "next/image";
import { Container } from "@uoguelph/react-components/container";
import { Typography } from "@uoguelph/react-components/typography";
import { fetchLdapProfile } from "@/lib/ldap-utils";

export type ProfileProps = {
  id: string;
  pre?: React.ReactNode;
  post?: React.ReactNode;
};

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

  // Use centralLoginId from GraphQL data
  const uid = (content as any).centralLoginId;
  
  // Fetch LDAP data if any directory fields are enabled and we have a uid
  const shouldFetchLdap = uid && ((content as any).directoryEmail || (content as any).directoryOffice || (content as any).directoryPhone);
  const ldapData = shouldFetchLdap ? await fetchLdapProfile(uid) : null;

  // Build contact info array to avoid complex conditional markup
  const contactInfo = [];
  if ((content as any).directoryEmail && ldapData?.mail) {
    contactInfo.push(
      <>
        <i className="fa-solid fa-envelope me-2" aria-hidden="true"></i>
        <span className="sr-only">Email:</span>{ldapData.mail}
      </>
    );
  }
  if ((content as any).directoryOffice && ldapData?.roomNumber && typeof ldapData.roomNumber === 'string' && ldapData.roomNumber.trim()) {
    contactInfo.push(
      <>
        <strong>Office:</strong> {ldapData.roomNumber}
      </>
    );
  }
  if ((content as any).directoryPhone && ldapData?.telephoneNumber && typeof ldapData.telephoneNumber === 'string' && ldapData.telephoneNumber.trim()) {
    contactInfo.push(
      <>
        <i className="fa-solid fa-phone me-2" aria-hidden="true"></i>
        <span className="sr-only">Phone:</span>{ldapData.telephoneNumber}
      </>
    );
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
          <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
            {content.profilePicture && (
              <Image
                alt={content.profilePicture.image.alt ?? ""}
                height={content.profilePicture.image.height}
                width={content.profilePicture.image.width}
                src={content.profilePicture.image.url}
                className="rounded-lg w-full max-w-full md:w-1/3 md:max-w-1/3 object-cover"
              />
            )}
            <div className="flex-1">
              {/* Directory contact info from LDAP */}
              {contactInfo.length > 0 && (
                <Typography type="body" className="mb-4">
                  {contactInfo.map((info, index) => (
                    <>
                      {index > 0 && <br />}
                      {info}
                    </>
                  ))}
                </Typography>
              )}
              <HtmlParser key="profile-body" html={content.body?.processed ?? ""} instructions={undefined} />
              {content.uniwebId && (
                <Link href={`https://uniweb.uoguelph.ca/members/${content.uniwebId}/profile`}>
                  View UniWeb profile
                </Link>
              )}
            </div>
          </div>
          {content?.profileSections?.map((section, index) => (
            <div key={index}>
              <Typography type="h2" as="h2">
                {section.profilePartLabel}
              </Typography>
              <HtmlParser key={section.id} html={section.profilePartText?.processed ?? ""} instructions={undefined} />
            </div>
          ))}

          {post && post}
        </Container>
      </LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}
