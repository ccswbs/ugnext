import React from 'react';
import { Heading } from '@/components/heading';

export const GraduateProgramSummary = ({ data }) => {
  if (!data) {
    return <div>No data to see here :(</div>;
  }

  return (<>
    {/* <Heading level={2}>Program Summary</Heading> */}
    <div className="mx-auto p-5 bg-gray-900">      
      <dl>
        <dt className="text-yellow-400 font-bold">Degree</dt>
        <dd className="text-white leading-relaxed">{data.degree_type} - {data.degree_name}</dd>

        <dt className="text-yellow-400 font-bold">Delivery</dt>
        <dd className="text-white">{data.delivery_method}</dd>
        
        <dt className="text-yellow-400 font-bold">Duration</dt>
        <dd className="text-white">
          {data.program_length}
          {data.part_time_available && (
            <>
              <br />
              part-time is available
            </>
          )}
        </dd>
        
        <dt className="text-yellow-400 font-bold">Admission Average</dt>
        <dd className="text-white">{data.admission_average}</dd>

        <dt className="text-yellow-400 font-bold">Program type</dt>
        <dd className="text-white">{data.program_type}</dd>
      </dl>
      <Heading level={3} className="text-yellow-400">Intake Terms</Heading>
      <p className="text-white">Domestic: Summer, Fall, Winter</p>
      <p className="text-white">International: Summer, Fall, Winter</p>
      <Heading level={3} className="text-yellow-400">Intake Deadline</Heading>
      {data.intake_term_domestic && <>
      <Heading level={4} className="text-yellow-400">Domestic</Heading>
      <ul>
        {data.intake_term_domestic.map(term => (
        <li key={term.name} className="text-white">
          {term.deadline} ({term.name})
        </li>
        ))}
      </ul>
      </>}
      
      {data.intake_term_international && <>
      <Heading level={4} className="text-yellow-400">International</Heading>
      <ul>
        {data.intake_term_international.map(term => (
        <li key={term.name} className="text-white">
          {term.deadline} ({term.name})
        </li>
        ))}
      </ul>
      </>}
    </div>
  </>);
};

