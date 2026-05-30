import Link from "next/link";

interface ClaimCardProps {
  claim: {
    id: string;
    slug: string;
    title: string;
    category: string;
    deadline: string;
    estimatedMin: number;
    estimatedMax: number;
    needReceipt: boolean;
    payPaypal?: boolean;
    payBank?: boolean;
    payCheck?: boolean;
    scoreTotal: number;
  };
  country?: string;
  showRank?: number;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-600 bg-green-50";
  if (score >= 60) return "text-blue-600 bg-blue-50";
  if (score >= 40) return "text-yellow-600 bg-yellow-50";
  return "text-red-600 bg-red-50";
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    "data-breach": "Data Breach",
    "class-action": "Class Action",
    "consumer-settlement": "Consumer Settlement",
  };
  return labels[category] || category;
}

function getDaysUntilDeadline(deadline: string): number {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  return Math.ceil(
    (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
}

export function ClaimCard({
  claim,
  country = "us",
  showRank,
}: ClaimCardProps) {
  const daysLeft = getDaysUntilDeadline(claim.deadline);

  return (
    <Link
      href={`/${country}/${claim.slug}`}
      className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
    >
      <div className="flex items-start gap-4">
        {showRank && (
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
            #{showRank}
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {claim.title}
            </h3>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(claim.scoreTotal)}`}
            >
              {claim.scoreTotal}/100
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div>
              <div className="text-sm text-gray-500">Estimated Payout</div>
              <div className="text-lg font-bold text-green-600">
                ${claim.estimatedMin} - ${claim.estimatedMax}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Category</div>
              <div className="font-medium">
                {getCategoryLabel(claim.category)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Deadline</div>
              <div
                className={`font-medium ${daysLeft < 30 ? "text-red-600" : ""}`}
              >
                {daysLeft > 0 ? `${daysLeft} days left` : "Expiring soon"}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Requirements</div>
              <div className="flex flex-wrap gap-1">
                {claim.needReceipt ? (
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">
                    Receipt
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                    No Receipt
                  </span>
                )}
                {claim.payPaypal && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    PayPal
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
