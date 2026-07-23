import {
  Map,
  Target,
  BarChart3,
  Briefcase,
} from "lucide-react";

export interface Feature {
  title: string;
  description: string;
  icon: React.ElementType;
}

export const FEATURES: Feature[] = [
  {
    title: "AI Personalized Roadmap",
    description:
      "No generic tutorials. CareerSaathi creates a roadmap based on your target role, current skills, and timeline.",
    icon: Map,
  },
  {
    title: "Daily Action Plan",
    description:
      "Know exactly what to learn every day instead of wasting time deciding your next step.",
    icon: Target,
  },
  {
    title: "Track Your Progress",
    description:
      "Weekly reports and milestones help you stay consistent and measure your improvement.",
    icon: BarChart3,
  },
  {
    title: "Interview Ready",
    description:
      "Prepare with company-focused questions, technical concepts, and practical coding challenges.",
    icon: Briefcase,
  },
];