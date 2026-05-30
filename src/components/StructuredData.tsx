interface StructuredDataProps {
  type: "Article" | "FAQPage" | "WebPage";
  data: Record<string, any>;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// Pre-built structured data for claims
export function ClaimStructuredData({
  title,
  description,
  url,
  datePublished,
  dateModified,
  estimatedMin,
  estimatedMax,
  deadline,
}: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  estimatedMin: number;
  estimatedMax: number;
  deadline: string;
}) {
  return (
    <StructuredData
      type="Article"
      data={{
        headline: title,
        description: description,
        url: url,
        datePublished: datePublished,
        dateModified: dateModified,
        author: {
          "@type": "Organization",
          name: "ClaimRadar",
        },
        publisher: {
          "@type": "Organization",
          name: "ClaimRadar",
          url: "https://claimradar.com",
        },
        about: {
          "@type": "Thing",
          name: "Class Action Settlement",
        },
        additionalProperty: [
          {
            "@type": "PropertyValue",
            name: "Estimated Payout",
            value: `$${estimatedMin} - $${estimatedMax}`,
          },
          {
            "@type": "PropertyValue",
            name: "Deadline",
            value: deadline,
          },
        ],
      }}
    />
  );
}

// FAQ structured data
export function FAQStructuredData({
  items,
}: {
  items: Array<{ question: string; answer: string }>;
}) {
  return (
    <StructuredData
      type="FAQPage"
      data={{
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }}
    />
  );
}

// WebPage structured data
export function WebPageStructuredData({
  title,
  description,
  url,
  datePublished,
  dateModified,
}: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
}) {
  return (
    <StructuredData
      type="WebPage"
      data={{
        name: title,
        description: description,
        url: url,
        datePublished: datePublished,
        dateModified: dateModified,
        publisher: {
          "@type": "Organization",
          name: "ClaimRadar",
          url: "https://claimradar.com",
        },
      }}
    />
  );
}
