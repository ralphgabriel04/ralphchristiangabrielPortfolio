import { type HTMLAttributes, forwardRef } from "react";

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-muted border border-border-color rounded-lg transition-all duration-200 ease-out hover:shadow-md hover:border-border-strong ${className}`}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";
export { Card };
