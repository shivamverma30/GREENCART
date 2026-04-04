import React from "react";

const Loader = ({ label = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/30 border-t-primary"></div>
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
};

export default Loader;
