import Input from "../../../components/ui/Input/Input";

interface SkillScoreFieldProps {
    skillName: string;

    obtainedMarks: number | "";

    totalMarks: number | "";

    onObtainedMarksChange: (
        value: number | ""
    ) => void;

    onTotalMarksChange: (
        value: number | ""
    ) => void;
}

const SkillScoreField = ({
    skillName,
    obtainedMarks,
    totalMarks,
    onObtainedMarksChange,
    onTotalMarksChange,
}: SkillScoreFieldProps) => {
    const invalidMarks =
        typeof obtainedMarks === "number" &&
        typeof totalMarks === "number" &&
        obtainedMarks > totalMarks;

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="font-semibold text-slate-900">
                {skillName}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
                Enter the result from your assessment.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Obtained Marks
                    </label>

                    <Input
                        type="number"
                        min={0}
                        value={obtainedMarks}
                        error={invalidMarks}
                        placeholder="e.g. 72"
                        onChange={(event) => {
                            const value =
                                event.target.value;

                            onObtainedMarksChange(
                                value === ""
                                    ? ""
                                    : Number(value)
                            );
                        }}
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Total Marks
                    </label>

                    <Input
                        type="number"
                        min={1}
                        value={totalMarks}
                        error={invalidMarks}
                        placeholder="e.g. 100"
                        onChange={(event) => {
                            const value =
                                event.target.value;

                            onTotalMarksChange(
                                value === ""
                                    ? ""
                                    : Number(value)
                            );
                        }}
                    />
                </div>
            </div>

            {invalidMarks && (
                <p className="mt-2 text-sm text-red-500">
                    Obtained marks cannot be greater
                    than total marks.
                </p>
            )}
        </div>
    );
};

export default SkillScoreField;