import React from "react";

export const CareersTab = ({ data, activeTab }) => {
  return (
    <div id="careers" className={activeTab === "#careers" ? "" : "hidden"}>
      <p className="pl-2">This is test content for Careers tab</p>
    </div>
  );
};
