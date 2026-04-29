interface TagProps {
  children: React.ReactNode;
}

export function Tag({ children }: TagProps) {
  return (
    <span className="inline-flex font-mono text-xs px-2 py-[3px] border border-border-color rounded bg-background text-foreground mr-1 mb-1">
      {children}
    </span>
  );
}
