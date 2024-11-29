// pages/profile-page.js
import Head from "next/head";
import { Layout } from "@/components/layout";
import { useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import React from 'react';
import UniWebProfile from '../components/uniweb-profile';

export default function ProfilePage() {
  return (
    <Layout metadata={{ title: "Profile Test" }}>
      <Container>
        <h1>Data Display</h1>
        <UniWebProfile />
      </Container>
    </Layout>
  );
}