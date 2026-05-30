import Link from "next/link";

interface RelatedLink {
  title: string;
  href: string;
  description: string;
  icon: string;
}

interface InternalLinksProps {
  title?: string;
  links: RelatedLink[];
  columns?: 2 | 3 | 4;
}

export function InternalLinks({
  title = "Related Pages",
  links,
  columns = 3,
}: InternalLinksProps) {
  const gridCols =
    columns === 2
      ? "grid-cols-1 md:grid-cols-2"
      : columns === 4
        ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        : "grid-cols-1 md:grid-cols-3";

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        🔗 {title}
      </h2>
      <div className={`grid ${gridCols} gap-4`}>
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{link.icon}</span>
              <h3 className="font-semibold text-gray-900">{link.title}</h3>
            </div>
            <p className="text-sm text-gray-500">{link.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

// Pre-built link sets
export function ClaimPageLinks() {
  const links: RelatedLink[] = [
    {
      title: "No Receipt Claims",
      href: "/us/no-receipt-claims",
      description: "Browse claims that don't require receipts",
      icon: "✅",
    },
    {
      title: "PayPal Settlements",
      href: "/us/paypal-settlements",
      description: "Get paid faster with PayPal",
      icon: "💳",
    },
    {
      title: "Highest Paying Claims",
      href: "/us/highest-paying-settlements",
      description: "Find the biggest payouts",
      icon: "💰",
    },
    {
      title: "Best Settlements 2026",
      href: "/us/best-settlements-2026",
      description: "Top-rated by Claim Score",
      icon: "⭐",
    },
  ];

  return <InternalLinks title="Explore More Claims" links={links} />;
}

export function CategoryPageLinks() {
  const links: RelatedLink[] = [
    {
      title: "Data Breach Settlements",
      href: "/data-breach",
      description: "Compensation for data breaches",
      icon: "🔓",
    },
    {
      title: "Class Action Lawsuits",
      href: "/class-action",
      description: "Group lawsuits against corporations",
      icon: "⚖️",
    },
    {
      title: "Consumer Settlements",
      href: "/consumer-settlement",
      description: "Refunds for products and services",
      icon: "🛒",
    },
    {
      title: "Expiring Soon",
      href: "/expiring-soon",
      description: "Claims with deadlines approaching",
      icon: "⏰",
    },
  ];

  return <InternalLinks title="Browse by Category" links={links} />;
}

export function StatePageLinks({ state }: { state: string }) {
  const links: RelatedLink[] = [
    {
      title: "No Receipt Claims",
      href: `/us/${state}/no-receipt`,
      description: "Claims without receipt requirements",
      icon: "✅",
    },
    {
      title: "PayPal Claims",
      href: `/us/${state}/paypal`,
      description: "Get paid via PayPal",
      icon: "💳",
    },
    {
      title: "Highest Paying",
      href: `/us/${state}/highest-paying`,
      description: "Biggest payouts in your state",
      icon: "💰",
    },
    {
      title: "All US Claims",
      href: "/us",
      description: "Browse all US settlements",
      icon: "🇺🇸",
    },
  ];

  return <InternalLinks title="More in Your State" links={links} />;
}

export function USStateList({ currentState }: { currentState?: string }) {
  const states = [
    { code: "ca", name: "California" },
    { code: "tx", name: "Texas" },
    { code: "fl", name: "Florida" },
    { code: "ny", name: "New York" },
    { code: "il", name: "Illinois" },
    { code: "pa", name: "Pennsylvania" },
    { code: "oh", name: "Ohio" },
    { code: "ga", name: "Georgia" },
    { code: "nc", name: "North Carolina" },
    { code: "mi", name: "Michigan" },
    { code: "nj", name: "New Jersey" },
    { code: "va", name: "Virginia" },
  ];

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        🗺️ Browse by State
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {states.map((s) => (
          <Link
            key={s.code}
            href={`/us/${s.code}`}
            className={`px-3 py-2 rounded-lg text-sm font-medium text-center ${
              s.code === currentState
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {s.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
