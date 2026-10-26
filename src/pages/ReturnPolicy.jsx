import React from "react";
import CancellationRefundPolicy from "./CancellationRefundPolicy";

// Re-export CancellationRefundPolicy to maintain single-source-of-truth across /return-policy and /cancellation-refund-policy
const ReturnPolicy = () => {
  return <CancellationRefundPolicy />;
};

export default ReturnPolicy;