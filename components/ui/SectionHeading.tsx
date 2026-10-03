interface SectionHeadingProps {
  children: React.ReactNode;
  sub?: string;
  as?: 'h1' | 'h2';
}

export function SectionHeading({ children, sub, as = 'h2' }: SectionHeadingProps) {
  const Tag = as;
  return (
    <div className="mb-5">
      <Tag className="display-section text-ink">{children}</Tag>
      {sub ? <p className="mt-1.5 text-sm text-ink-2">{sub}</p> : null}
    </div>
  );
}
