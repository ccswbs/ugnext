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
import { fetchLdapProfile } from "@/lib/ldap-utils";
import { getProfile } from "@/lib/uniweb-utils";

// Component to display Uniweb research interests
async function UniwebResearchInterests({ uniwebId }: { uniwebId: string }) {
  try {
    const uniwebProfile = await getProfile(uniwebId);
    
    if (uniwebProfile.research_interests && uniwebProfile.research_interests.length > 0) {
      const sortedInterests = uniwebProfile.research_interests
        .sort((a, b) => parseInt(a.order) - parseInt(b.order));
      
      return (
        <div className="mb-4">
          <Typography type="h3" as="h3" className="mb-2">
            Research Interests
          </Typography>
          <ul className="list-disc list-inside space-y-1 ml-4">
            {sortedInterests.map((interest) => (
              <li key={interest.id}>
                <Typography type="body" className="inline">
                  {interest.interest[1]}
                </Typography>
              </li>
            ))}
          </ul>
        </div>
      );
    }
  } catch (error) {
    console.error('Error fetching Uniweb research interests:', error);
  }
  
  return null;
}

interface ProfileContent {
  status: boolean;
  id: string;
  title: string;
  path?: string;
  centralLoginId: string;
  directoryEmail: boolean;
  directoryOffice: boolean;
  directoryPhone: boolean;
  uniwebId?: string;
  uniwebAffiliations?: boolean;
  uniwebCurrentTeaching?: boolean;
  uniwebDegrees?: boolean;
  uniwebPublications?: boolean;
  uniwebResearchDesc?: boolean;
  uniwebResearchInterests?: boolean;
  primaryNavigation?: {
    menuName?: string;
  };
  body?: {
    processed?: string;
  };
  profileJobTitle?: string;
  profilePicture?: {
    image: {
      alt?: string;
      height: number;
      width: number;
      url: string;
    };
  };
  profileSections?: Array<{
    id: string;
    profilePartLabel: string;
    profilePartText?: {
      processed?: string;
    };
  }>;
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

  // Use centralLoginId from GraphQL data
  const uid = content.centralLoginId;
  
  // Fetch LDAP data if any directory fields are enabled and we have a uid
  const shouldFetchLdap = uid && (content.directoryEmail || content.directoryOffice || content.directoryPhone);
  const ldapData = shouldFetchLdap ? await fetchLdapProfile(uid) : null;

  // Build contact info array to avoid complex conditional markup
  const contactInfo = [];
  if (content.directoryEmail && ldapData?.mail) {
    contactInfo.push(
      <>
        <i className="fa-solid fa-envelope me-2" aria-hidden="true"></i>
        <span className="sr-only">Email:</span>{ldapData.mail}
      </>
    );
  }
  if (content.directoryOffice && ldapData?.roomNumber && typeof ldapData.roomNumber === 'string' && ldapData.roomNumber.trim()) {
    contactInfo.push(
      <>
        <i className="fa-solid fa-building-columns me-2" aria-hidden="true"></i>
        <span className="sr-only">Office:</span>{ldapData.roomNumber}
      </>
    );
  }
  if (content.directoryPhone && ldapData?.telephoneNumber && typeof ldapData.telephoneNumber === 'string' && ldapData.telephoneNumber.trim()) {
    contactInfo.push(
      <>
        <i className="fa-solid fa-phone me-2" aria-hidden="true"></i>
        <span className="sr-only">Phone:</span>{ldapData.telephoneNumber}
        {ldapData.telephoneNumber2 && typeof ldapData.telephoneNumber2 === 'string' && ldapData.telephoneNumber2.trim() && (
          <>
            <br />
            <span className="ms-6">{ldapData.telephoneNumber2}</span>
          </>
        )}
      </>
    );
  }

  return (
    <Layout>
      <Header name={content.primaryNavigation?.menuName?.toUpperCase().replaceAll("-", "_")}></Header>

      <LayoutContent container={false}>
        <Breadcrumbs url={content.path ?? undefined} />
        <Container>
          <div className="md:flex md:flex-row-reverse md:gap-6">
            <div className="md:flex-1">
              <Typography type="h1" as="h1" className="mb-4">
                {content?.title}
              </Typography>
              {pre && pre}

              {content.profileJobTitle && <Typography type="h3" as="p">{content.profileJobTitle}</Typography>}
                  
              {/* Directory contact info from LDAP */}
              {contactInfo.length > 0 && (
                <Typography type="body" className="mb-4">
                  {contactInfo.map((info, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && <br />}
                      {info}
                    </React.Fragment>
                  ))}
                </Typography>
              )}
              
              {/* TODO: add a Boolean field for profile users to choose if they want this displayed */}
              {content.uniwebId && (
                <Link href={`https://uniweb.uoguelph.ca/members/${content.uniwebId}/profile`}>
                  View UniWeb profile
                </Link>          
              )}
              
              {content.uniwebResearchInterests && content.uniwebId && (
                <UniwebResearchInterests uniwebId={content.uniwebId} />
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
          <HtmlParser key="profile-body" html={content.body?.processed ?? ""} instructions={undefined} />
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
