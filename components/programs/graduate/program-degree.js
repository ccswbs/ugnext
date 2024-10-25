import { Layout } from "@/components/layout";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { twJoin } from "tailwind-merge";
import { toTitleCase } from "@/lib/string-utils";
import { GraduateProgramHero } from "@/components/programs/graduate/hero";
import { GraduateProgramSummary } from "@/components/programs/graduate/summary";
import { GraduateProgramInfo } from "@/components/programs/graduate/information";
import { CollaborativeSpecializations } from "@/components/programs/graduate/sessions/collaborative-specializations";
import { ProgramTestimonial } from "@/components/programs/graduate/sessions/program-testimonial";
import { HowToApply } from "@/components/programs/graduate/sessions/how-to-apply";
import { FundYourEducation } from "@/components/programs/graduate/sessions/fund-your-education";
import { ApplyNow } from "@/components/programs/graduate/sessions/apply-now";

export const GraduateProgramDegreePage = ({ data, isFallback }) => (
  <Layout title="Graduate Programs">
    <GraduateProgramHero />
    <Container className={twJoin(isFallback && "hidden", "px-0")} centered>
      {/* add test breadcrumbs, will replace breadcrumbs code here once merge with basic page branch*/}
      <div className="session md:px-20 max-w-1680 mx-auto px-4">
        <p>
          <i className="fa-solid fa-house"></i> &gt; Academics &gt; Graduate &gt; Biostatistics &gt; Master's
          Degree(Thesis-Based)
        </p>
      </div>
      <div className="session md:px-20 max-w-1680 mx-auto px-4">
        <Heading level={1}>
          {" "}
          {data?.program_parent} | {data?.degree_name} - {toTitleCase(data?.program_type)} ({data?.degree_type})
        </Heading>
      </div>
      <div className="session md:px-20 max-w-1680 mx-auto px-4 pb-10">
        <GraduateProgramInfo data={data} />
        <GraduateProgramSummary data={data} />
      </div>
      <div className="session w-full mx-auto">
        <ProgramTestimonial data={data} />
      </div>
      <div className="session md:px-20 max-w-1680 mx-auto px-4">
        <CollaborativeSpecializations data={data} />
      </div>
      <div className="session md:px-20 max-w-1680 mx-auto px-4">
        <HowToApply />
      </div>
      <div className="session md:px-20 max-w-1680 mx-auto px-4">
        <FundYourEducation />
      </div>
      <div className="session md:px-20 max-w-1680 mx-auto px-4">
        <ApplyNow />
      </div>
    </Container>
  </Layout>
);
