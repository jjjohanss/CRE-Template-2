import React from "react";
import { RefreshCw } from "lucide-react";

// Shown when a list couldn't be loaded (instead of a misleading "nothing found").
export default function LoadError({ what = "listings", onRetry, className = "" }) {
  return (
    <div role="alert" className={`text-center py-16 ${className}`}>
      <p className="text-gray-600 text-lg font-medium">We couldn't load the {what} right now.</p>
      <p className="text-gray-400 text-sm mt-1">Please check your connection and try again.</p>
      {onRetry && (
        <button
          type="button"
          onClick={() => onRetry()}
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-[#C8102E] hover:bg-[#a00d24] text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <RefreshCw size={14} /> Try again
        </button>
      )}
    </div>
  );
}
