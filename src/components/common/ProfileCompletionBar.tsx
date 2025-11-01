import { useState } from "react";
import { Link } from "react-router";
import { CloseIcon, UserCircleIcon } from "../../icons";

interface ProfileCompletionBarProps {
  completionPercentage: number;
  missingFields: string[];
  onDismiss?: () => void;
}

export default function ProfileCompletionBar({ 
  completionPercentage, 
  missingFields, 
  onDismiss 
}: ProfileCompletionBarProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  if (isDismissed || completionPercentage >= 100) {
    return null;
  }

  return (
    <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800/30 dark:bg-amber-900/10">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <UserCircleIcon className="size-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">
              Complete Your Profile
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
              Your profile is {completionPercentage}% complete. Add the missing information to get the most out of your account.
            </p>
            
            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-amber-700 dark:text-amber-300">
                  Progress
                </span>
                <span className="text-xs font-medium text-amber-800 dark:text-amber-200">
                  {completionPercentage}%
                </span>
              </div>
              <div className="w-full bg-amber-200 rounded-full h-2 dark:bg-amber-800/30">
                <div 
                  className="bg-amber-500 h-2 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Missing Fields */}
            {missingFields.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-amber-700 dark:text-amber-300 mb-1">
                  Missing information:
                </p>
                <div className="flex flex-wrap gap-1">
                  {missingFields.map((field, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-md bg-amber-100 text-xs text-amber-800 dark:bg-amber-800/20 dark:text-amber-200"
                    >
                      {field}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Button */}
            <Link
              to="/profile"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors"
            >
              Complete Profile
            </Link>
          </div>
        </div>
        
        {/* Dismiss Button */}
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200 transition-colors"
          aria-label="Dismiss notification"
        >
          <CloseIcon className="size-4" />
        </button>
      </div>
    </div>
  );
}