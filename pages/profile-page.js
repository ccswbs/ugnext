// pages/profile-page.js
import Head from "next/head";
import { Layout } from "@/components/layout";
import { useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { HtmlParser } from "@/components/html-parser";
import React from 'react';
import { useUniWebProfile } from '@/lib/uniweb-utils';

export default function ProfilePage() {
  const userId = 66; // Replace with the desired ID
  const userPicture = "https://uoguelph-dev.uniweb.io/picture.php?action=display&contentType=members&id=" + userId;
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

  const membershipInfo = data["profile/membership_information"];
  const researchInterests = data["profile/research_interests"];
  const researchDescription = data["profile/research_description"];
  const biography = data["profile/biography"];
  
  // Filter out objects without an 'order' property and sort by 'order'
  const sortedInterests = researchInterests.filter(item => item.order).sort((a, b) => parseInt(a.order) - parseInt(b.order));

  return (
    <Layout metadata={{ title: "UniWEB Test" }}>
      <Container centered>
        <Heading level={1}>
          {membershipInfo.first_name} {membershipInfo.last_name}
        </Heading>        
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:max-w-max">
            <img src={userPicture} alt="Profile Photo" className="max-w-full h-auto" />
          </div>
          <div className="w-full md:flex-1 p-4">
            <span className="text-xl font-semibold">{membershipInfo.position_title[1]}</span><br />
            {membershipInfo.academic_unit[1]}<br />
            {membershipInfo.academic_unit[2]}<br />
            {membershipInfo.academic_unit[3]}<br />
            {membershipInfo.email}<br />
            {membershipInfo.telephone}<br />
            {membershipInfo.homepage}
          </div>
        </div>
        <HtmlParser html={biography.academic_biography.en} />
        <Heading level={3}>Research description</Heading>
        <p>{researchDescription.research_description.en}</p>
        <Heading level={3}>Research Interests</Heading>
        <ul>
        {sortedInterests.map(item => (
            <li key={item.order}>{item.interest[1]}</li>
        ))}
        </ul>
        {/* <Heading level={2}>Raw Data</Heading>
        <UniWebProfileRaw id={userId} /> */}
      </Container>
    </Layout>
  );
}