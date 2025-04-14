import React from "react";

export const Loader: React.FC<{ className?: string }> = ({ className }) => {
  return <div className={`loader ${className}`}></div>;
};
