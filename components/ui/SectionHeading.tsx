interface SectionHeadingProps {
  children: React.ReactNode;
  sub?: string;
}

export function SectionHeading({ children, sub }: SectionHeadingProps) {
  return (
    <div className="mb-5">
      <h2 className="display-section text-ink">{children}</h2>
      {sub ? <p className="mt-1.5 text-sm text-ink-2">{sub}</p> : null}
    </div>
  );
}
