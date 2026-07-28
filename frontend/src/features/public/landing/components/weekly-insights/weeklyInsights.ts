import {
    BarChart3,
    Brain,
    RefreshCw,
    Target,
} from "lucide-react";

export interface WeeklyInsight {
    title: string;
    description: string;
    icon: React.ElementType;
}

export const WEEKLY_INSIGHTS: WeeklyInsight[] = [

    {
        title: "Understand Your Week",
        description:
            "See a clear summary of your progress, consistency, confidence, and motivation.",
        icon: Brain,
    },

    {
        title: "Measure Skill Growth",
        description:
            "Track assessment performance and see how individual skills improve from week to week.",
        icon: BarChart3,
    },

    {
        title: "Identify What Needs Attention",
        description:
            "CareerSaathi highlights achievements, weak areas, and the topics that need more practice.",
        icon: Target,
    },

    {
        title: "Adapt Your Next Mission",
        description:
            "Your results influence revision priorities, workload, and what CareerSaathi plans next.",
        icon: RefreshCw,
    },

];