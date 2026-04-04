import React from "react";
import Button from "./Button";

const EmptyState = ({ title, description, actionLabel, onAction }) => {
  return (
    <div className="glass-surface animate-rise rounded-2xl p-8 text-center">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted">{description}</p>
      {actionLabel && onAction ? (
        <Button onClick={onAction} className="mt-5">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
};

export default EmptyState;
