import React from "react";

const GlassCard = ({ children, className = "" }) => {
  return <div className={`glass-surface rounded-2xl ${className}`}>{children}</div>;
};

export default GlassCard;
