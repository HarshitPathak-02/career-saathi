import {
  Sparkles,
} from "lucide-react";

const DOT_DELAYS = [
  "0ms",
  "150ms",
  "300ms",
];

const DiscoveryTypingIndicator = () => {
  return (
    <div className="flex justify-start gap-3">
      <div
        className="
          mt-1
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-blue-50
          text-blue-600
        "
      >
        <Sparkles size={16} />
      </div>

      <div
        className="
          rounded-2xl
          rounded-tl-sm
          border
          border-slate-200
          bg-white
          px-4
          py-4
          shadow-sm
        "
      >
        <span className="sr-only">
          CareerSaathi is thinking
        </span>

        <div className="flex items-center gap-1.5">
          {DOT_DELAYS.map((delay) => (
            <span
              key={delay}
              className="
                h-1.5
                w-1.5
                animate-bounce
                rounded-full
                bg-slate-400
              "
              style={{
                animationDelay: delay,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiscoveryTypingIndicator;
