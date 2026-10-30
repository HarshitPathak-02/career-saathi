import {
  AlertCircle,
  ArrowRight,
  Clock3,
  Compass,
  MessageCircle,
  Sparkles,
  Target,
} from "lucide-react";

import Button from "../../../components/ui/Button/Button";

interface DiscoveryIntroProps {
  isStarting: boolean;

  error: string | null;

  onStart: () => void;
}

const discoveryPoints = [
  {
    icon: MessageCircle,
    title: "Have a short conversation",
    description:
      "Share what you enjoy, how you like to work, and what matters to you.",
  },
  {
    icon: Target,
    title: "Clarify your direction",
    description:
      "CareerSaathi asks focused questions to understand the path that fits you.",
  },
  {
    icon: Sparkles,
    title: "Get a starting point",
    description:
      "Your answers help shape the next steps in your career journey.",
  },
];

const DiscoveryIntro = ({
  isStarting,
  error,
  onStart,
}: DiscoveryIntroProps) => {
  return (
    <section
      className="
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
      "
    >
      <div className="relative px-5 py-7 sm:px-8 sm:py-9">
        <div
          className="
            pointer-events-none
            absolute
            -right-20
            -top-24
            h-64
            w-64
            rounded-full
            bg-blue-50
            blur-3xl
          "
        />

        <div className="relative">
          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-blue-100
              bg-blue-50
              px-3
              py-1.5
              text-xs
              font-semibold
              text-blue-700
            "
          >
            <Compass size={14} />
            AI-guided career discovery
          </div>

          <h2
            className="
              mt-5
              text-2xl
              font-bold
              tracking-tight
              text-slate-900
              sm:text-3xl
            "
          >
            Let&apos;s find a direction that fits you
          </h2>

          <p
            className="
              mt-3
              max-w-2xl
              text-sm
              leading-7
              text-slate-600
              sm:text-base
            "
          >
            This is a short, judgment-free conversation. There are no wrong
            answers. The more honestly you share, the more useful your
            recommendations will be.
          </p>

          <div className="mt-7 grid gap-3 md:grid-cols-3">
            {discoveryPoints.map((point) => {
              const Icon = point.icon;

              return (
                <div
                  key={point.title}
                  className="
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50/70
                    p-4
                  "
                >
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-lg
                      bg-white
                      text-blue-600
                      shadow-sm
                    "
                  >
                    <Icon size={18} />
                  </div>

                  <h3
                    className="
                      mt-4
                      text-sm
                      font-semibold
                      text-slate-900
                    "
                  >
                    {point.title}
                  </h3>

                  <p
                    className="
                      mt-2
                      text-sm
                      leading-6
                      text-slate-500
                    "
                  >
                    {point.description}
                  </p>
                </div>
              );
            })}
          </div>

          {error && (
            <div
              className="
                mt-6
                flex
                items-start
                gap-3
                rounded-xl
                border
                border-red-200
                bg-red-50
                p-4
              "
              role="alert"
            >
              <AlertCircle
                size={19}
                className="mt-0.5 shrink-0 text-red-600"
              />

              <p className="text-sm leading-6 text-red-700">
                {error}
              </p>
            </div>
          )}

          <div
            className="
              mt-7
              flex
              flex-col
              gap-4
              border-t
              border-slate-200
              pt-6
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Clock3 size={16} />
              Takes about 5 minutes
            </div>

            <Button
              onClick={onStart}
              loading={isStarting}
              size="lg"
              className="w-full sm:w-auto"
            >
              <span className="inline-flex items-center justify-center gap-2">
                Start career discovery
                <ArrowRight size={17} />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscoveryIntro;
