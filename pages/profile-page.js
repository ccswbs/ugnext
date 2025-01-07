// pages/profile-page.js
import Head from "next/head";
import { Layout } from "@/components/layout";
import { useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import React from 'react';
import { useUniWebProfile, UniWebProfileRaw } from '@/lib/uniweb-utils';

export default function ProfilePage() {
  const userId = 66; // Replace with the desired ID
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
  //console.log(researchInterests);
  
  // Filter out objects without an 'order' property and sort by 'order'
const sortedInterests = researchInterests.filter(item => item.order).sort((a, b) => parseInt(a.order) - parseInt(b.order));

  return (
    <Layout metadata={{ title: "UniWEB Test" }}>
      <Container centered>
        <Heading level={1}>UniWEB Test</Heading>
        <Heading level={2}>
          {membershipInfo.first_name} {membershipInfo.last_name}
        </Heading>
        <p>{membershipInfo.position_title[1]}</p>
        <p>{membershipInfo.academic_unit[2]}</p>
        <p>{membershipInfo.email}</p>
        <Heading level={3}>Research Interests</Heading>
        <ul>
        {sortedInterests.map(item => (
            <li key={item.order}>{item.interest[1]}</li>
        ))}
        </ul>
      <Heading level={2}>Raw Data</Heading>
      <UniWebProfileRaw id={userId} />
      </Container>
    </Layout>
  );
}