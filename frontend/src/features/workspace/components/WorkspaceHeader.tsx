import type {
    WorkspaceCareerJourney,
    WorkspaceUser,
} from "../types/workspace.types";

interface WorkspaceHeaderProps {
    user: WorkspaceUser;

    careerJourney: WorkspaceCareerJourney;
}

const WorkspaceHeader = ({
    user,
    careerJourney,
}: WorkspaceHeaderProps) => {
    return (
        <section
            className="
        rounded-xl
        border
        border-slate-200
        bg-white
        p-6
      "
        >
            <div>
                <p className="text-sm text-slate-500">
                    Welcome back
                </p>

                <h1 className="mt-1 text-2xl font-semibold text-slate-900">
                    Hello {user.firstName} 👋
                </h1>

                <p className="mt-2 text-slate-600">
                    Your personalized career journey is ready.
                    Keep moving one step closer to your goal.
                </p>
            </div>

            <div
                className="
          mt-6
          grid
          gap-4
          sm:grid-cols-2
          lg:grid-cols-4
        "
            >
                <JourneyInfo
                    label="Target Role"
                    value={careerJourney.targetRole}
                />

                <JourneyInfo
                    label="Domain"
                    value={careerJourney.targetDomain}
                />

                <JourneyInfo
                    label="Target Company"
                    value={
                        careerJourney.targetCompany ||
                        "Not specified"
                    }
                />

                <JourneyInfo
                    label="Journey Duration"
                    value={`${careerJourney.targetDurationMonths} months`}
                />
            </div>
        </section>
    );
};

interface JourneyInfoProps {
    label: string;
    value: string;
}

const JourneyInfo = ({
    label,
    value,
}: JourneyInfoProps) => {
    return (
        <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase text-slate-500">
                {label}
            </p>

            <p className="mt-1 font-medium text-slate-900">
                {value}
            </p>
        </div>
    );
};

export default WorkspaceHeader;