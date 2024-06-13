import React from 'react';
import { Heading } from '@/components/heading';

export const GraduateProgramSummary = ({ data }) => {
  if (!data) {
    return <div>No data to see here :(</div>;
  }

  // Helper function to render deadline lists
  const renderDeadlines = (termName, domesticDeadline, internationalDeadline) => (
    <>
      <Heading level={4}>{termName} Entry</Heading>
      <ul>
        {domesticDeadline && <li>Domestic: {domesticDeadline}</li>}
        {internationalDeadline && <li>International: {internationalDeadline}</li>}
      </ul>
    </>
  );

  // Find deadlines for each term
  const findDeadline = (term, intakeArray) => intakeArray.find(item => item.name === term)?.deadline;

  return (
    <div>
      <Heading level={2}>Program Summary</Heading>
      <dl>
        <dt>Degree:</dt><dd>{data.degree_type} - {data.degree_name}</dd>
        <dt>Program type:</dt> <dd>{data.program_type}</dd>
        <dt>Duration:</dt><dd>{data.program_length}</dd>
        <dt>Delivery:</dt><dd>{data.delivery_method}</dd>
        <dt>Part-time available:</dt><dd>{data.part_time_available ? 'Yes' : 'No'}</dd>
        <dt>Admission Average:</dt><dd>{data.admission_average}</dd>
      </dl>
      <Heading level={3}>Program Entry & Deadlines</Heading>
      {renderDeadlines('Summer', findDeadline('Summer', data.intake_term_domestic), findDeadline('Summer', data.intake_term_international))}
      {renderDeadlines('Fall', findDeadline('Fall', data.intake_term_domestic), findDeadline('Fall', data.intake_term_international))}
      {renderDeadlines('Winter', findDeadline('Winter', data.intake_term_domestic), findDeadline('Winter', data.intake_term_international))}
    </div>
  );
};

