import { type ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "default" | "sm" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary: "bg-foreground text-background border-foreground hover:opacity-[0.88]",
  secondary: "bg-transparent text-foreground border-border-strong hover:bg-muted",
  ghost: "bg-transparent text-foreground border-transparent hover:bg-muted",
};

const sizeStyles: Record<Size, string> = {
  default: "px-5 py-2.5 min-h-[44px] text-sm",
  sm: "px-3 py-1.5 min-h-[32px] text-[13px]",
  icon: "w-11 min-h-[44px] p-0",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "default", className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 rounded-md font-medium font-sans cursor-pointer border transition-all duration-150 ease-out whitespace-nowrap select-none active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
export { Button, type ButtonProps };
