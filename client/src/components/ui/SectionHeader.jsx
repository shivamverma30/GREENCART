import React from "react";

const SectionHeader = ({ title, subtitle, rightContent }) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
      </div>
      {rightContent ? <div>{rightContent}</div> : null}
    </div>
  );
};

export default SectionHeader;
