import React from "react";
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
import { LdapContactInfo } from "@/components/server/ldap-contact-info";
import { getIconForUrl } from "@/lib/ug-utils";
import { 
  UniwebAffiliations,
  UniwebCurrentTeaching,
  UniwebDegrees,
  UniwebPublications,
  UniwebResearchDesc,
  UniwebResearchInterests 
} from "@/components/server/uniweb-components";
import { FullProfile } from "@/lib/types/profile";

// Component-specific interface that extends the shared FullProfile type
interface ProfileContent extends FullProfile {
  // Additional fields specific to the server component can be added here
}

export type ProfileProps = {
  id: string;
  pre?: React.ReactNode;
  post?: React.ReactNode;
};

export async function Profile({ id, pre, post }: ProfileProps) {
  const content = await getProfileContent(id) as ProfileContent | null;

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
          <Typography type="h1" as="h1" className="mb-4">
            {content?.title}       
          </Typography>
          <div className="md:flex md:flex-row-reverse md:gap-6">
            <div className="md:flex-1">              
              {pre && pre}
              {content.profileJobTitle && <Typography type="h3" as="p">{content.profileJobTitle}</Typography>}
              {content.profileUnit && content.profileUnit.length > 0 && (
                <Typography type="body" as="p" className="mb-2">
                  {content.profileUnit.map(unit => unit.name).join(', ')}
                </Typography>
              )}
              
              {/* Directory contact info from LDAP */}
              <LdapContactInfo 
                centralLoginId={content.centralLoginId}
                directoryEmail={content.directoryEmail}
                directoryOffice={content.directoryOffice}
                directoryPhone={content.directoryPhone}
              />

              {/* Custom links if available */}
              {content.customLink && content.customLink.length > 0 && (
                <div className="mb-4">
                  {content.customLink.map((link, idx) => (
                    <div key={idx} className="mb-2">
                      <Link href={link.url} className="flex items-center gap-2">
                        <i className={`${getIconForUrl(link.url)} w-4`} aria-hidden="true"></i>
                        <span>{link.title}</span>
                      </Link>
                    </div>
                  ))}
                </div>
              )}

              {/* Profile Fields */}
              {content.profileFields && content.profileFields.length > 0 && (
                <div className="mb-4">
                  {content.profileFields.map((field, index) => (
                    <div key={index} className="mb-3">
                      <div className="font-bold mb-1">
                        <HtmlParser html={field.label?.processed ?? ""} instructions={undefined} />
                      </div>
                      <div>
                        <HtmlParser html={field.value?.processed ?? ""} instructions={undefined} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Research Areas */}
              {content.profileResearchAreas?.length && (
                <div className="mb-4">
                  <Typography type="h3" as="h2" className="mb-2">
                    Research Areas
                  </Typography>
                  <ul className="list-disc list-inside">
                    {content.profileResearchAreas.map((area) => (
                      <li key={area.id}>
                        <Typography type="body" as="span">
                          {area.name}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
                      
            {content.profilePicture && (
              <Image
                alt={content.profilePicture.image.alt ?? ""}
                height={content.profilePicture.image.height}
                width={content.profilePicture.image.width}
                src={content.profilePicture.image.url}
                className="w-full max-w-full md:w-1/3 md:max-w-1/3 object-cover mb-4 md:mb-0"
              />
            )}
          </div>
          {/* Parse and render the Body field */}
          <HtmlParser key="profile-body" html={content.body?.processed ?? ""} instructions={undefined} />
          
          {/* Render all Profile Sections in order (both regular parts and UniWeb parts) */}
          {content?.profileSections?.map((section, index) => {
            // Regular profile part with custom content
            if (section.profilePartLabel && !section.uniwebSelect) {
              return (
                <div key={section.id || index}>
                  <Typography type="h2" as="h2">
                    {section.profilePartLabel}
                  </Typography>
                  <HtmlParser key={section.id} html={section.profilePartText?.processed ?? ""} instructions={undefined} />
                </div>
              );
            }
            
            // UniWeb profile part
            if (section.uniwebSelect?.name && content.uniwebId) {
              const sectionName = section.uniwebSelect.name;
              
              switch (sectionName) {
                case 'Affiliations':
                  return <UniwebAffiliations key={index} uniwebId={content.uniwebId} />;
                case 'Research Description':
                  return <UniwebResearchDesc key={index} uniwebId={content.uniwebId} />;
                case 'Current Teaching':
                  return <UniwebCurrentTeaching key={index} uniwebId={content.uniwebId} />;
                case 'Selected Degrees':
                  return <UniwebDegrees key={index} uniwebId={content.uniwebId} />;
                case 'Selected Publications':
                  return <UniwebPublications key={index} uniwebId={content.uniwebId} />;
                case 'Research Interests':
                  return <UniwebResearchInterests key={index} uniwebId={content.uniwebId} />;
                default:
                  return null;
              }
            }
            
            // Empty section or unrecognized format
            return null;
          })}

          {post && post}
        </Container>
      </LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}
