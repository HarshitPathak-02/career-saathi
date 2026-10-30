import {
  Sparkles,
  User,
} from "lucide-react";

import type {
  DiscoveryMessage,
} from "../types/discovery.types";

interface DiscoveryMessageBubbleProps {
  message: DiscoveryMessage;
}

const DiscoveryMessageBubble = ({
  message,
}: DiscoveryMessageBubbleProps) => {
  const isAssistant =
    message.senderRole === "assistant";

  return (
    <div
      className={`
        flex
        w-full
        gap-3
        ${isAssistant
          ? "justify-start"
          : "justify-end"
        }
      `}
    >
      {isAssistant && (
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
      )}

      <div
        className={`
          max-w-[85%]
          rounded-2xl
          px-4
          py-3
          text-sm
          leading-6
          shadow-sm
          sm:max-w-[75%]

          ${isAssistant
            ? `
              rounded-tl-sm
              border
              border-slate-200
              bg-white
              text-slate-700
            `
            : `
              rounded-tr-sm
              bg-blue-600
              text-white
            `
          }
        `}
      >
        <p className="whitespace-pre-wrap break-words">
          {message.content}
        </p>
      </div>

      {!isAssistant && (
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
            bg-slate-200
            text-slate-600
          "
        >
          <User size={16} />
        </div>
      )}
    </div>
  );
};

export default DiscoveryMessageBubble;
