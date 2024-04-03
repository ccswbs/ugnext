import React from 'react';
import { DrupalState } from '@pantheon-systems/drupal-kit';
import Link from 'next/link';
import Layout from '../components/layout.jsx';
import { NextSeo } from 'next-seo';
export default function Pages({ data }) {
    //return <pre>{JSON.stringify(pages, null, 4)}</pre>;
    
    
    const pages = data.getPages;    
    let accordionData = data.getAccordions;
    const programs = data.getPrograms;
    const tags = data.getEdges;
    
    const pageTags = [];    
    const pubPages = [];
    const unpubPages = [];
    const pubPrograms = [];
    const unpubPrograms = [];
    //const pages = data.allNodePage.edges;
    //const programs = data.programs.edges;
    //const tags = data.tags.edges;

    console.log(pages)

    let pubPagesUntagged = [];
    let unpubPagesUntagged = [];

    //let accordionData = data.accordion;
    
    // Fetch tags used on pages
    /*for (let i=0; i<tags.length; i++) {
        if (tags[i].relationships?.node__page?.length > 0) {
            pageTags.push(tags[i])            
        }
    }*/
    // Sort pages into pubbed vs unpubbed
    for (let i=0; i<pages.length; i++) {
        if (pages[i].status === true) {
            pubPages.push(pages[i])
        } else {
            unpubPages.push(pages[i])
        }
    }
    // Sort programs into pubbed vs unpubbed
    /*for (let i=0; i<programs.length; i++) {
        if (programs[i].status === true) {
            pubPrograms.push(programs[i])
        } else {
            unpubPrograms.push(programs[i])
        }
    }*/
    // Collect untagged pages
    pubPagesUntagged = pubPages.filter(page => page.field_tags.length === 0);
    unpubPagesUntagged = unpubPages.filter(page => page.field_tags.length === 0);

	return (
		<Layout>
        {/*<Seo title="Content Hub Webpage Inventory" />*/}
        <NextSeo
				title="Content Hub Webpage Inventory"
				description="Content Hub Webpage Inventory"
			/>
      <section>
        <div className="container page-container ps-w-full ps-p-4">
          <div className="site-content">
            <div className="content-area">
              <h1>Content Hub Webpage Inventory</h1>
{/*
              <p>Use this page to quickly find and preview your Content Hub webpages.</p>              
              <p>Pages are organized into 2 main sections: <a href="#published">Published</a> and <a href="#unpublished">Unpublished</a>. Under these sections, pages are divided up even further by their tags (ie. "Admission", "Convocation", "OAC", and so on). If a page has more than one tag, it will be listed more than once, with untagged pages listed at the end.</p>
              <p>When you create a new page, please be sure to tag it with the correct tag(s). It's possible to have more than one tag on a single page if that page either belongs to two different units or belongs to a micro-site. What does this mean? Check out the Tagging Scenarios below:</p>
              
			  <h2>Tagging Scenarios</h2>
              accordionData &&
                <div className="accordion mb-5" id={"accordion" + accordionData.id}>
                { accordionData.accordion.map( (item, index) =>
                    <div className="accordion-item" key={"item" + index}>
                        <h3 className="accordion-header" id={"heading" + index}>
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={"#part" + index} aria-expanded="false" aria-controls={"part" + index}>
                                {item.title !== "" ? item.title : "Read More"}
                            </button>
                        </h3>
                        <div id={"part" + index} className="accordion-collapse collapse" aria-labelledby={"heading" + index}>            
                            <div className="accordion-body" dangerouslySetInnerHTML={{__html: item.content}} />
                        </div>
                    </div>
                )}
                </div>
              

              <p> If you are new to the Content Hub and your tags are not yet in our system, please contact the CCS team to have them added. Once it's added, you can create more pages and assign that tag without the help of CCS.</p>
              <h2>Want to quickly find your page?</h2>
              <p>"Control+F" (or "Command+F" on a Mac) is the keyboard shortcut for the Find command. While on this webpage, press the Ctrl key and the F key at the same time to bring up a search box in the top right corner of the screen.</p>
*/}
              
              <h2 id="published">Published Content</h2>
              <h3>Basic Pages</h3>
              
              {pageTags.map((tag) => {
                const taggedPages = tag.relationships.node__page;
                const taggedPagesPubbed = taggedPages.filter(page => page.status === true);
                taggedPagesPubbed.sort((a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0));
                return (taggedPagesPubbed.length > 0 && 
                  <React.Fragment key={`tagged-fragment-${tag.name}`}>
                    <h4 className="text-dark">{tag.name}</h4>
                    {tag.description?.processed && <div dangerouslySetInnerHTML={{__html: tag.description.processed}}></div>}
                    <p>Total pages: <strong>{taggedPagesPubbed.length}</strong></p>
                      <ul className="three-col-md">
                        {taggedPagesPubbed.map((taggedPage, index) => (
                            <li key={`tagged-${index}`}><Link href={taggedPage.path.alias}>{taggedPage.title}</Link></li>
                        ))}
                      </ul>
                  </React.Fragment>)
              })}
              
              <h4>Untagged Pages</h4>
              <p>Total: <strong>{pubPagesUntagged.length}</strong></p>
              <ul className="three-col-md">
                  {pubPagesUntagged.map((page) => (
                      <li key={page.drupal_id}><Link href={page.path.alias}>{page.title}</Link></li>
                  ))}
              </ul>
{/*
              <h3>Programs</h3>
              <p>Total: <strong>{pubPrograms.length}</strong></p>
              <ul className="three-col-md">
                  {pubPrograms.map((program) => (
                      <li key={program.drupal_id}><Link to={program.path.alias}>{program.title}</Link></li>
                  ))}
              </ul>
              
              <h2 id="unpublished">Unpublished Content</h2>
              <p>Unpublished pages and programs are only visible on preview and test sites.</p>
              
              {unpubPages.length > 0 && <h3>Basic Pages</h3>}
              {pageTags.map((tag) => {
                const taggedPages = tag.relationships.node__page;
                const taggedPagesUnpubbed = taggedPages.filter(page => page.status === false);
                taggedPagesUnpubbed.sort((a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0));
                return (taggedPagesUnpubbed.length > 0 && 
                  <React.Fragment key={`tagged-fragment-${tag.name}`}>
                  <h4 className="text-dark">{tag.name}</h4> 
                  <p>Total: <strong>{taggedPagesUnpubbed.length}</strong></p>
                  <ul className="three-col-md">
                    {taggedPagesUnpubbed.map((taggedPage, index) => (
                      <li key={`tagged-${index}`}><Link to={taggedPage.path.alias}>{taggedPage.title}</Link></li>
                    ))}
                  </ul>
                </React.Fragment>)
              })}
              
              {unpubPagesUntagged.length > 0 && <>
              <h4>Untagged Pages</h4>
              <p>Total: <strong>{unpubPagesUntagged.length}</strong></p>
              <ul className="three-col-md">
                  {unpubPagesUntagged.map((page) => (
                      <li key={page.drupal_id}><Link to={page.path.alias}>{page.title}</Link></li>
                  ))}
              </ul>
              </>}              
                            
              {unpubPrograms.length > 0 && <>
                <h3>Programs</h3>
                <p>Total: <strong>{unpubPrograms.length}</strong></p>
                <ul className="three-col-md">
                    {unpubPrograms.map((program) => (
                        <li key={program.drupal_id}><Link to={program.path.alias}>{program.title}</Link></li>
                    ))}
                </ul>
              </>}
              */}
            </div>
          </div>
          
        </div>
        </section>
    </Layout>
	)
  
}


export async function getServerSideProps(context) {
    const { locale } = context; // use the current locale in order to fetch correct translation

    const store = new DrupalState({
        apiBase: process.env.BACKEND_URL,
		clientId: process.env.CLIENT_ID,
  		clientSecret: process.env.CLIENT_SECRET,
    });

    
    const graphqlQuery = `
    query {
      nodeQuery(
        filter: { conditions: [{ field: "type", value: "page" }] }
        sort: { field: "title", direction: ASC }
      ) {
        entities {
          ... on NodePage {
            title
            drupal_id
            path {
              alias
            }
            relationships {
              field_tags {
                __typename
                ... on TaxonomyInterface {
                  drupal_id
                  id
                  name
                }
              }
            }
            status
          }
        }
      }
    }
    `;

    const getPages = await store.getObject({
      objectName: 'node--page',
      //params: "fields[node--page]=title,field_tags&sort=-title",
	  //useQuery: graphqlQuery,
		//id: '98a35585-f26b-47d5-b7e7-4f88f6126655',
		query: `
		{
			id
			title
			body
			path {
				alias
			}
		}
		`,
    });
    if (!getPages) {
			throw new Error(
				'No pages returned. Make sure the objectName and params are valid!',
			);
		}

/*
    const getAccordions = await store.getObject({
      objectName: 'paragraph--accordion_block',
      query: `
      accordion: homeYaml(yamlId: {eq: "home_accordion"}) {
        id
        accordion {
          title
          content
        }
      }
      `,
    });

    const getPrograms = await store.getObject({
      objectName: 'node--program',
      query: `
      {
        id
      }
    `,
    });

    const getEdges = await store.getObject({
      objectName: 'taxonomy_term--units',
      query: `
      tags: allTaxonomyInterface(sort: {name: ASC}) {
        edges {
          node {
            ... on taxonomy_term__tags {
              name
              description {
                processed
              }
              relationships {
                node__page {
                  status
                  title
                  path {
                    alias
                  }
                }
              }
            }
            ... on taxonomy_term__units {
              name
              description {
                processed
              }
              relationships {
                node__page {
                  status
                  title
                  path {
                    alias
                  }
                }
              }
            }
          }
        }
      }
      `,
    });
    */

    return {
        props: {
          data:{
            getPages,
            //getAccordions,
            //getPrograms,
            //getEdges
          },
          
        },
    };
}