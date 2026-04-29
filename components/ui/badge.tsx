interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 px-2.5 py-1 text-xs font-mono rounded-full border border-border-color text-muted-foreground bg-background ${className}`}
    >
      {children}
    </span>
  );
}
