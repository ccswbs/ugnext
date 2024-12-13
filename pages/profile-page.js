// pages/profile-page.js
import Head from "next/head";
import { Layout } from "@/components/layout";
import { useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import React from 'react';
import { UniWebProfile, UniWebUnitMembers } from '../components/uniweb-utils';

export default function ProfilePage() {
  const userId = 353; // Replace with the desired ID

  return (
    <Layout metadata={{ title: "UniWEB Test" }}>
      <Container>
        <h1 className="font-bold my-7 text-4xl mb-0">UniWEB Test</h1>
        <h2 className="font-bold my-3 text-3xl text-dark">Profile Data</h2>
        <UniWebProfile id={userId} />
        <h2 className="font-bold my-3 text-3xl text-dark">Member List</h2>
        <UniWebUnitMembers unitName="pathobiology" />
      </Container>
    </Layout>
  );
}