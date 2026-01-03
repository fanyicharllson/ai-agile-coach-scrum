import type { TrialStatus } from "@/types";

interface TrialStatusBannerProps {
  trialStatus: TrialStatus;
}

export function TrialStatusBanner({ trialStatus }: TrialStatusBannerProps) {
  // Don't show banner for unlimited users
  if (trialStatus.isUnlimited) {
    return null;
  }

  return (
    <div className="px-6 pb-2">
      <div className="max-w-4xl mx-auto">
        {trialStatus.hasReachedLimit ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="shrink-0">
                <svg
                  className="w-5 h-5 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-800 dark:text-red-200">
                  Trial Limit Reached
                </h3>
                <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                  You've used all {trialStatus.trialLimit} trial messages. To
                  continue learning with AgileMentor AI, please contact us at{" "}
                  <a
                    href="mailto:fanyicharllson@gmail.com"
                    className="font-medium underline hover:text-red-900 dark:hover:text-red-100"
                  >
                    fanyicharllson@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`border rounded-lg p-3 ${
              trialStatus.remainingMessages === 1
                ? "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800"
                : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <svg
                  className={`w-4 h-4 ${
                    trialStatus.remainingMessages === 1
                      ? "text-orange-600 dark:text-orange-400"
                      : "text-blue-600 dark:text-blue-400"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span
                  className={`text-sm font-medium ${
                    trialStatus.remainingMessages === 1
                      ? "text-orange-800 dark:text-orange-200"
                      : "text-blue-800 dark:text-blue-200"
                  }`}
                >
                  Trial: {trialStatus.remainingMessages}{" "}
                  {trialStatus.remainingMessages === 1 ? "message" : "messages"}{" "}
                  remaining
                </span>
              </div>
              <a
                href="mailto:fanyicharllson@gmail.com"
                className={`text-xs font-medium underline ${
                  trialStatus.remainingMessages === 1
                    ? "text-orange-700 dark:text-orange-300 hover:text-orange-900 dark:hover:text-orange-100"
                    : "text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100"
                }`}
              >
                Upgrade Access
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
