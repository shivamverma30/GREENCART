import React from "react";

const Button = ({ children, className = "", variant = "primary", ...props }) => {
  const baseClass = "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition focus:outline-none";
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-dull",
    ghost: "bg-transparent text-theme-primary hover:bg-black/5 dark:hover:bg-white/10",
    muted: "bg-white/50 text-theme-primary border border-theme hover:bg-white/70 dark:bg-white/10 dark:hover:bg-white/20",
  };

  return (
    <button className={`${baseClass} ${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
