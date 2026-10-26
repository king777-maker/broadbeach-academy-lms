import React from "react";
import TermsAndConditions from "./TermsAndConditions";

// Re-export TermsAndConditions to guarantee single-source-of-truth legal terms
const TermsOfUse = () => {
  return <TermsAndConditions />;
};

export default TermsOfUse;