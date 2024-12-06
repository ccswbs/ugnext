import React from "react";
import { CourseAndCareer } from "@/components/programs/graduate/sessions/course-career";
import { WhatIs } from "@/components/programs/graduate/sessions/what-is";

export const GraduateProgramInfo = ({ data }) => (
  <>
    <WhatIs />
    <CourseAndCareer data={data} />
  </>
);
