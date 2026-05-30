interface TimelineStep {
  label: string;
  date: string;
  status: "completed" | "current" | "upcoming";
  description?: string;
}

interface TimelineProps {
  steps: TimelineStep[];
  title?: string;
}

export function Timeline({ steps, title = "Claim Timeline" }: TimelineProps) {
  return (
    <section className="bg-white rounded-2xl shadow p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        📅 {title}
      </h2>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="relative flex items-start gap-6">
              {/* Dot */}
              <div
                className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  step.status === "completed"
                    ? "bg-green-500 border-green-500"
                    : step.status === "current"
                      ? "bg-blue-500 border-blue-500"
                      : "bg-white border-gray-300"
                }`}
              >
                {step.status === "completed" && (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
                {step.status === "current" && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-8">
                <div className="flex items-center gap-3 mb-1">
                  <h3
                    className={`font-semibold ${
                      step.status === "completed"
                        ? "text-green-700"
                        : step.status === "current"
                          ? "text-blue-700"
                          : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </h3>
                  <span
                    className={`text-sm px-2 py-0.5 rounded ${
                      step.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : step.status === "current"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {step.date}
                  </span>
                </div>
                {step.description && (
                  <p className="text-sm text-gray-500 mt-1">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Pre-built timeline for claims
export function ClaimTimeline({
  openDate,
  deadline,
  payoutDate,
}: {
  openDate: string;
  deadline: string;
  payoutDate?: string;
}) {
  const now = new Date();
  const open = new Date(openDate);
  const deadlineDate = new Date(deadline);
  const payout = payoutDate ? new Date(payoutDate) : null;

  const steps: TimelineStep[] = [
    {
      label: "Claims Open",
      date: new Date(openDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status: now >= open ? "completed" : "upcoming",
      description: "Settlement claims period begins",
    },
    {
      label: "Submit Your Claim",
      date: "Now",
      status: now >= open && now <= deadlineDate ? "current" : now > deadlineDate ? "completed" : "upcoming",
      description: "File your claim before the deadline",
    },
    {
      label: "Claims Deadline",
      date: new Date(deadline).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status: now > deadlineDate ? "completed" : "upcoming",
      description: "Last day to submit your claim",
    },
    {
      label: "Court Approval",
      date: "TBD",
      status: "upcoming",
      description: "Court reviews and approves the settlement",
    },
    {
      label: "Payments Sent",
      date: payout
        ? payout.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "TBD",
      status: "upcoming",
      description: "Approved claimants receive payment",
    },
  ];

  return <Timeline steps={steps} title="Settlement Timeline" />;
}
