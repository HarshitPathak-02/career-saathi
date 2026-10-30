import {
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";

import {
  Loader2,
  Send,
} from "lucide-react";

import Button from "../../../components/ui/Button/Button";
import Textarea from "../../../components/ui/TextArea/Textarea";

interface DiscoveryComposerProps {
  isSending: boolean;

  quickReplies: string[];

  onSend: (answer: string) => Promise<boolean>;
}

const DiscoveryComposer = ({
  isSending,
  quickReplies,
  onSend,
}: DiscoveryComposerProps) => {
  const [
    answer,
    setAnswer,
  ] = useState("");

  const trimmedAnswer =
    answer.trim();

  const isDisabled =
    isSending ||
    trimmedAnswer.length === 0;

  const handleSubmit = async (
    event?: FormEvent<HTMLFormElement>
  ) => {
    event?.preventDefault();

    if (isDisabled) {
      return;
    }

    const sent =
      await onSend(trimmedAnswer);

    if (sent) {
      setAnswer("");
    }
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      void handleSubmit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3"
    >
      {quickReplies.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Suggestions
          </p>

          <div className="flex flex-wrap gap-2">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                type="button"
                onClick={() =>
                  setAnswer(reply)
                }
                disabled={isSending}
                className="
                  cursor-pointer
                  rounded-full
                  border
                  border-slate-300
                  bg-white
                  px-3
                  py-1.5
                  text-xs
                  font-medium
                  text-slate-600
                  transition
                  hover:border-blue-300
                  hover:text-blue-700
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  focus:ring-offset-2
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {reply}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label
          htmlFor="discovery-answer"
          className="sr-only"
        >
          Your answer
        </label>

        <Textarea
          id="discovery-answer"
          value={answer}
          onChange={(event) =>
            setAnswer(event.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="Type your answer..."
          rows={3}
          disabled={isSending}
          className="
            bg-white
            disabled:cursor-not-allowed
            disabled:bg-slate-50
          "
        />
      </div>

      <div
        className="
          flex
          flex-col
          gap-3
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <p className="text-xs leading-5 text-slate-400">
          Press Enter to send. Use Shift + Enter for a new line.
        </p>

        <Button
          type="submit"
          disabled={isDisabled}
          className="w-full shrink-0 sm:w-auto"
        >
          <span className="inline-flex items-center justify-center gap-2">
            {isSending ? (
              <>
                <Loader2
                  size={16}
                  className="animate-spin"
                />
                Sending...
              </>
            ) : (
              <>
                <Send size={16} />
                Send
              </>
            )}
          </span>
        </Button>
      </div>
    </form>
  );
};

export default DiscoveryComposer;
