// pages/profile-page.js
import Head from "next/head";
import { Layout } from "@/components/layout";
import { useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { HtmlParser } from "@/components/html-parser";
import { Link } from "@/components/link";
import { List } from "@/components/list";
import React from 'react';
import { formatPhoneNumber, useUniWebProfile } from '@/lib/uniweb-utils';

export default function ProfilePage() {
  const userId = 770; // Daniel Gillis
  //const userId = 324; // Pamela Jacobs
  const userPicture = `${process.env.NEXT_PUBLIC_UNIWEB_URL}/picture.php?action=display&contentType=members&id=${userId}`;
  const { loading, error, data } = useUniWebProfile(userId);

  if (loading) {
    return (
      <Layout metadata={{ title: "UniWEB Test" }}>        
        <Container>
          <Heading level={1}>UniWEB Test</Heading>
          <p>Loading...</p>
        </Container>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout metadata={{ title: "UniWEB Test" }}>
        <Container>
          <Heading level={1}>UniWEB Test</Heading>
          <p>Error: {error}</p>
        </Container>
      </Layout>
    );
  }

  const membershipInfo = data?.membership_information[0];
  const selected_publications = data?.selected_publications;
  const researchInterests = data?.research_interests;
  const researchDescription = data?.research_description?.[0]?.research_description
    ? JSON.parse(data.research_description[0].research_description).en
    : null;
  const academicBiography = data?.biography?.[0]?.academic_biography
    ? JSON.parse(data.biography[0].academic_biography).en
    : null;
    
  // Filter out objects without an 'order' property and sort by 'order'
  const sortedInterests = researchInterests.filter(item => item.order).sort((a, b) => parseInt(a.order) - parseInt(b.order));

  return (
    <Layout metadata={{ title: `${membershipInfo.first_name} ${membershipInfo.last_name} | Profile` }}>
      <Container centered>
        <Heading level={1}>
          {membershipInfo.first_name} {membershipInfo.last_name}
        </Heading>        
        <div className="flex flex-col md:flex-row mb-3">
          <div className="w-full md:max-w-max">
            <img src={userPicture} alt="Profile Photo" className="max-w-full h-auto" />
          </div>
          <div className="w-full md:flex-1 p-4">
            <span className="text-xl font-semibold">{membershipInfo.position_title[1]}</span><br />
            {membershipInfo.academic_unit[1]}<br />
            {membershipInfo.academic_unit[2]}<br />
            {membershipInfo.academic_unit[3]}<br />
            {membershipInfo.email && <><i className="fa-solid fa-envelope"></i> {membershipInfo.email}<br /></>}
            {membershipInfo.office && <><i className="fa-solid fa-building"></i> Office: {membershipInfo.office}<br /></>}
            {membershipInfo.telephone && <><i className="fa-solid fa-phone"></i> {formatPhoneNumber(membershipInfo.telephone)}<br /></>}
            {membershipInfo.homepage && <><i className="fa-solid fa-globe-pointer"></i> <Link href={membershipInfo.homepage}>Website</Link></>}
          </div>
        </div>
        {academicBiography && (
          <>
            <HtmlParser html={academicBiography} />
          </>
        )}
        {researchDescription && (
          <>
            <Heading level={3}>Research Description</Heading>
            <HtmlParser html={researchDescription} />
          </>
        )}
        {sortedInterests && sortedInterests.length > 0 && (
          <>
            <Heading level={3}>Research Interests</Heading>
            <List>
              {sortedInterests.map(item => (
                <li key={item.order}>{item.interest[1]}</li>
              ))}
            </List>
          </>
        )}
      </Container>
    </Layout>
  );
}