"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  title?: string;
  items: FAQItem[];
}

export function FAQ({ title = "Frequently Asked Questions", items }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-gray-50 rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        ❓ {title}
      </h2>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <button
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              onClick={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
            >
              <span className="font-semibold text-gray-900">
                {item.question}
              </span>
              <span className="text-2xl text-gray-400">
                {openIndex === index ? "−" : "+"}
              </span>
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4">
                <p className="text-gray-600">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// Pre-built FAQ sets for common scenarios
export function ClaimFAQ({
  claimTitle,
  needReceipt,
  payPaypal,
  estimatedMin,
  estimatedMax,
}: {
  claimTitle: string;
  needReceipt: boolean;
  payPaypal: boolean;
  estimatedMin: number;
  estimatedMax: number;
}) {
  const items: FAQItem[] = [
    {
      question: `What is the ${claimTitle}?`,
      answer: `The ${claimTitle} is a legal settlement that provides compensation to eligible individuals who were affected.`,
    },
    {
      question: "Do I need receipts to file a claim?",
      answer: needReceipt
        ? "Yes, you will need to provide proof of purchase or receipts to file a claim."
        : "No, you don't need receipts to file a claim. You can apply with just your name and address.",
    },
    {
      question: "How much money can I get?",
      answer: `Estimated payouts range from $${estimatedMin} to $${estimatedMax}, depending on the number of claims filed and other factors.`,
    },
    {
      question: "How will I get paid?",
      answer: payPaypal
        ? "You can choose to receive payment via PayPal for faster delivery, or by check."
        : "Payments are typically made by check sent to your mailing address.",
    },
    {
      question: "How long does it take to get paid?",
      answer: "Payment timelines vary, but typically take 4-8 weeks after claim approval. PayPal payments may be faster.",
    },
  ];

  return <FAQ title="Claim FAQ" items={items} />;
}

export function CategoryFAQ({
  category,
  count,
}: {
  category: string;
  count: number;
}) {
  const categoryLabels: Record<string, string> = {
    "data-breach": "Data Breach",
    "class-action": "Class Action",
    "consumer-settlement": "Consumer Settlement",
  };

  const items: FAQItem[] = [
    {
      question: `What are ${categoryLabels[category] || category} settlements?`,
      answer: `These are legal settlements where companies compensate individuals for damages related to ${category.replace("-", " ")}.`,
    },
    {
      question: `How many ${categoryLabels[category]} settlements are currently active?`,
      answer: `There are currently ${count} active ${categoryLabels[category]?.toLowerCase()} settlements available.`,
    },
    {
      question: "How do I know if I qualify?",
      answer: "Check the specific settlement details to see if you meet the eligibility requirements. Many settlements are open to a wide range of individuals.",
    },
    {
      question: "Is it free to file a claim?",
      answer: "Yes, filing a claim is always free. Never pay someone to file a claim for you.",
    },
  ];

  return <FAQ title={`${categoryLabels[category]} FAQ`} items={items} />;
}

export function StateFAQ({
  stateName,
  claimCount,
}: {
  stateName: string;
  claimCount: number;
}) {
  const items: FAQItem[] = [
    {
      question: `How many settlements are available in ${stateName}?`,
      answer: `There are currently ${claimCount} active settlements available to ${stateName} residents.`,
    },
    {
      question: `Do I need to live in ${stateName} to qualify?`,
      answer: `For state-specific settlements, yes. However, many settlements are nationwide and available to all US residents.`,
    },
    {
      question: "How do I find settlements I qualify for?",
      answer: "Browse the settlements listed on this page and check the eligibility requirements for each one.",
    },
    {
      question: "Can I file claims in multiple states?",
      answer: "You can file claims for settlements in any state where you meet the eligibility requirements.",
    },
  ];

  return <FAQ title={`${stateName} Settlement FAQ`} items={items} />;
}
