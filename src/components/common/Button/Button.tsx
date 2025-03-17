import "./Button.scss";

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ onClick, children, className = "", disabled }) => {
  const spacingClass = className.includes("no-spacing") ? "btn-no-spacing" : "";

  return (
    <button className={`btn ${spacingClass}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};
