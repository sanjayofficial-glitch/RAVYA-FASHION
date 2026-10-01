import Link from 'next/link';

interface PillProps {
  href: string;
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

/** Filter pill — hairline by default, bronze hairline + tint when active. */
export function Pill({ href, active = false, children, onClick }: PillProps) {
  return (
    <Link
      href={href}
      onClick={(e) => {
        // href stays for shareability/crawlers; navigation is router-driven.
        e.preventDefault();
        onClick?.();
      }}
      scroll={false}
      aria-pressed={active}
      className={`inline-flex min-h-[40px] items-center whitespace-nowrap rounded-pill border px-4 py-2 text-sm font-medium transition-[background-color,border-color,color,transform] duration-150 ease-out active:scale-[0.97] ${
        active
          ? 'border-accent bg-accent/10 text-accent-ink'
          : 'border-line bg-canvas text-ink hover:border-ink'
      }`}
    >
      {children}
    </Link>
  );
}
