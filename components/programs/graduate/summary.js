import React from 'react';
import { Heading } from '@/components/heading';
import { HtmlParser } from '@/components/html-parser';
import { Link } from '@/components/link';
import { List, ListItem } from '@/components/list';

export const GraduateProgramSummary = ({ data }) => {
  if (!data) {
    return <div>No data to see here :(</div>;
  }

  return (
    <>
      {/* <Heading level={2}>Program Summary</Heading> */}
      <div id="program-summary" className="bg-gray-900 p-8 md:w-1/4">
        <dl className="!leading-loose">
          <dt className="font-bold text-yellow-400">Program type</dt>
          <dd className="text-white">{data.program_type}</dd>
          <dt className="font-bold text-yellow-400">Degree</dt>
          <dd className="leading-relaxed text-white">
            {data.degree_type} - {data.degree_name}
          </dd>
          <dt className="font-bold text-yellow-400">Delivery</dt>
          <dd className="text-white">{data.delivery_method}</dd>
          <dt className="font-bold text-yellow-400">Duration</dt>
          <dd className="text-white">
            {data.program_length}
            {data.part_time_available && (
              <>
                <br />
                part-time is available
              </>
            )}
          </dd>
          <dt className="font-bold text-yellow-400">Admission Average</dt>
          <dd className="text-white">{data.admission_average}</dd>
        </dl>
        <div id="intake-terms-deadlines">
          <Heading level={3} className="mb-2 mt-4 text-xl text-yellow-400 md:mt-0">
            Intake Terms & Deadlines
          </Heading>
          {data.intake_term_domestic && (
            <div id="intake-domestic">
              <Heading level={4} className="mb-2 mt-4 text-lg font-normal text-gray-400">
                Domestic
              </Heading>
              <List>
                {data.intake_term_domestic.map((term) => (
                  <ListItem key={term.name} className="text-white">
                    {term.deadline} ({term.name})
                  </ListItem>
                ))}
              </List>
            </div>
          )}
          {data.intake_term_international && (
            <div id="intake-international">
              <Heading level={4} className="mb-2 mt-4 text-lg font-normal text-gray-400">
                International
              </Heading>
              <List>
                {data.intake_term_international.map((term) => (
                  <ListItem key={term.name} className="text-white">
                    {term.deadline} ({term.name})
                  </ListItem>
                ))}
              </List>
            </div>
          )}
        </div>
        {data.resource_links && (
          <div id="program-resource-links" className="!leading-loose">
            <ul>
              {data.resource_links.map((resource) => (
                <li key={resource.name}>
                  <HtmlParser html={resource.icon} />{' '}
                  <Link href={resource.url} className="text-light-blue-300">
                    {resource.name}
                  </Link>
                </li>
              ))}
            </ul>
            {data.viewbook && (
              <p className="max-w-48 !leading-loose text-light-blue-300">
                [Viewbook image placement] <br />
                <a href={data.viewbook}>Download the Graduate & Postdoctoral Studies Viewbook</a>
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};
