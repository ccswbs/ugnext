//import Head from "next/head";
import { Container } from "@/components/container";
import { Layout } from "@/components/layout";
import { Link } from "@/components/link";
import { List } from "@/components/list";
import { Heading } from "@/components/heading";
import React from "react";
import { useEffect, useState } from "react";
import { useUnitMembers, useUnits } from '@/lib/uniweb-utils';

export default function ListUnits() {
  const units = ["4","5"];
  //const { loading, error, data } = useUnitMembers({ units });
  const { loading, error, data } = useUnits();
  
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
  
  //const unitList = data?.unitName;

  return (
    <Layout metadata={{ title: "UniWEB Units List" }}>
        <Container centered>
          <Heading level={1}>UniWEB Unit List</Heading>
          <div className="px-5">          
            <List>
              {data && data.map(item => (
                <li key={item.contentId}>                
                  {item.memberCount > 0 ?                   
                  <Link 
                    key={item.contentId} 
                    href={`/unit-members?unitId=${item.contentId}`} 
                    as={`/unit-members?unitId=${item.contentId}`}
                  >
                    {item.unitName} ({item.memberCount})
                  </Link>
                  :
                  item.unitName}
                </li>
              ))}
            </List>
          </div>
        </Container>
      </Layout>
  );
}

