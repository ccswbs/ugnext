import React from 'react';

export const PartnersTab = ({ data, activeTab }) => {
  return (
    <div id="partners" className={activeTab === '#partners' ? '' : 'hidden'}>
      <p className="pl-2">This is test content for Partners tab</p>
    </div>
  );
};
