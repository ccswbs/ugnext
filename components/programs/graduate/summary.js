import React from 'react';
import { Heading } from '@/components/heading';
import { Link } from '@/components/link';
import { List, ListItem } from '@/components/list';

export const GraduateProgramSummary = ({ data }) => {
  if (!data) {
    return <div>No data to see here :(</div>;
  }

  return (
    <>
      {/* <Heading level={2}>Program Summary</Heading> */}
      <div id="program-summary" className="mx-auto bg-gray-900 p-5 md:grid md:grid-cols-2 xl:block">
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
          <Heading level={3} className="mb-2 mt-4 text-xl text-yellow-400">
            Intake Terms &amp; Deadlines
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
        <div id="program-resource-links" className="!leading-relaxed">
          <ul>
            <li><Link href="#" className="text-light-blue-300">Collaborative Specializations</Link></li>
            <li><Link href="#" className="text-light-blue-300">Graduate Calendar</Link></li>
            <li><Link href="#" className="text-light-blue-300">Express Your Interest</Link></li>
            <li><Link href="#" className="text-light-blue-300">Print this Summary</Link></li>
            <li><Link href="#" className="text-light-blue-300">Download the Graduate &amp; Postdoctoral Studies Viewbook</Link></li>
          </ul>
        </div>
      </div>
    </>
  );
};
