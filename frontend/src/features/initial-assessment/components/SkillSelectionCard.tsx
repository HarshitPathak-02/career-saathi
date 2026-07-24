import {
    Check,
} from "lucide-react";

import type {
    CareerRoleSkill,
} from "../../career-setup/types/careerSetup.types";

interface SkillSelectionCardProps {
    skill: CareerRoleSkill;

    selected: boolean;

    onToggle: (
        skillId: string
    ) => void;
}

const SkillSelectionCard = ({
    skill,
    selected,
    onToggle,
}: SkillSelectionCardProps) => {
    return (
        <button
            type="button"
            onClick={() =>
                onToggle(skill.skillId)
            }
            className={`
                relative
                w-full
                rounded-xl
                border
                p-5
                text-left
                transition-all
                duration-200

                ${selected
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50"
                }
            `}
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="font-semibold text-slate-900">
                        {skill.name}
                    </h3>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {skill.category && (
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                                {skill.category}
                            </span>
                        )}

                        {skill.difficulty && (
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                                {skill.difficulty}
                            </span>
                        )}

                        {skill.isMandatory && (
                            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                                Required
                            </span>
                        )}
                    </div>
                </div>

                <div
                    className={`
                        flex
                        h-6
                        w-6
                        shrink-0
                        items-center
                        justify-center
                        rounded-md
                        border

                        ${selected
                            ? "border-indigo-600 bg-indigo-600 text-white"
                            : "border-slate-300 bg-white"
                        }
                    `}
                >
                    {selected && (
                        <Check size={15} />
                    )}
                </div>
            </div>
        </button>
    );
};

export default SkillSelectionCard;