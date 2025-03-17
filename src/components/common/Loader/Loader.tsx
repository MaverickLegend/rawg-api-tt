import React from "react";
import "./Loader.scss";

export const Loader: React.FC<{ className?: string }> = ({ className }) => {
  return <div className={`loader ${className}`}></div>;
};
