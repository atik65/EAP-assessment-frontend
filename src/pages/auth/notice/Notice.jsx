import { Info, Clock, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const Notice = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="absolute right-3 top-3 md:right-5 md:bottom-5 w-[calc(100%-1.5rem)] max-w-sm md:max-w-md animate-in fade-in slide-in-from-bottom-2 duration-500 z-50">
      <div className="relative overflow-hidden rounded-lg md:rounded-xl border border-amber-200 bg-linear-to-br from-amber-50 via-orange-50 to-amber-50 p-3 md:p-4 shadow-lg">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.1),transparent_50%)] animate-pulse" />

        {/* Content */}
        <div className="relative flex gap-2 md:gap-3">
          {/* Animated icon */}
          <div className="shrink-0">
            <div className="relative flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-amber-100 ring-2 md:ring-4 ring-amber-50">
              <Clock className="h-4 w-4 md:h-5 md:w-5 text-amber-600 animate-pulse" />
              <div className="absolute inset-0 rounded-full bg-amber-400 opacity-20 animate-ping" />
            </div>
          </div>

          {/* Text content */}
          <div className="flex-1 pt-0.5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-xs md:text-sm font-semibold text-amber-900">
                First Time Loading?
              </h3>
              <button
                onClick={() => setIsVisible(false)}
                className="shrink-0 rounded-md p-0.5 md:p-1 text-amber-600 hover:bg-amber-100 hover:text-amber-900 transition-colors"
                aria-label="Dismiss notice"
              >
                <X className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </button>
            </div>

            <p className="mt-0.5 md:mt-1 text-xs md:text-sm text-amber-800 leading-relaxed">
              Our Render server may take{" "}
              <span className="font-semibold">30-60 seconds</span> to wake up on
              the first request. Thanks for your patience! ☕
            </p>

            {/* Progress indicator */}
            <div className="mt-2 md:mt-3 flex items-center gap-2">
              <div className="flex-1 h-1 overflow-hidden rounded-full bg-amber-200">
                <div className="h-full w-1/3 rounded-full bg-linear-to-r from-amber-400 to-orange-400 animate-[shimmer_2s_ease-in-out_infinite]" />
              </div>
              <Info className="h-3 w-3 md:h-3.5 md:w-3.5 text-amber-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notice;
