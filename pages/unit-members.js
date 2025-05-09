import { Container } from "@/components/container";
import { Layout } from "@/components/layout";
import { Link } from "@/components/link"; // Use the custom Link component
import { List } from "@/components/list";
import { Heading } from "@/components/heading";
import React from "react";
import { useUnitMembers } from '@/lib/uniweb-utils';
import { useRouter } from "next/router";
//import { useState, useEffect } from 'react';


export default function ListMembers() {
  const router = useRouter();
  const {unitId} = router.query;
  const units = unitId ? [unitId] : [];
  const { loading, error, data } = useUnitMembers({ units });

  if (loading) {
    return (
      <Layout metadata={{ title: "UniWEB Units Test" }}>        
        <Container>
          <Heading level={1}>UniWEB Units Test</Heading>
          <p>Loading...</p>
        </Container>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout metadata={{ title: "UniWEB Units Test" }}>
        <Container>
          <Heading level={1}>UniWEB Units Test</Heading>
          <p>Error: {error}</p>
        </Container>
      </Layout>
    );
  }

  const unitName = data ? data[0].unitName : null;

  return (
    <Layout metadata={{ title: "UniWEB Member List" }}>
        <Container centered>
          <Heading level={1}>{unitName}</Heading>
          <pre>{JSON.stringify(data, null, 2)}</pre>
          <div className="px-5">
            <List>
              {data?.map(item => {
                // Parse the memberName to extract first and last names
                const [lastName, firstName] = item.memberName.split(",").map(part => part.trim().toLowerCase().replace(/\s+/g, "-"));
                const profileUrl = `/${firstName}-${lastName}`;

                return (
                  <li key={item.contentId}>
                    <Link href={{ pathname: profileUrl, query: { userId: item.contentId } }}>                   
                      {item.memberName}
                    </Link>
                  </li>
                );
              })}
            </List>
            {console.log(router.query)}
          </div>
        </Container>
      </Layout>
  );
}
// Pass userId internallystate={{ userId: item.contentId }}