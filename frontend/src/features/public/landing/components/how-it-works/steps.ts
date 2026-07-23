import {
  Target,
  Route,
  CheckSquare,
  Briefcase,
} from "lucide-react";

export interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
}

export const STEPS: Step[] = [
  {
    id: 1,
    title: "Set Your Career Goal",
    description:
      "Tell CareerSaathi about your target role, current skills, daily study hours and timeline.",
    icon: Target,
  },
  {
    id: 2,
    title: "Get Your AI Roadmap",
    description:
      "Receive a personalized roadmap with weekly goals and learning milestones.",
    icon: Route,
  },
  {
    id: 3,
    title: "Complete Daily Missions",
    description:
      "Finish focused coding, learning and interview tasks generated just for you.",
    icon: CheckSquare,
  },
  {
    id: 4,
    title: "Become Job Ready",
    description:
      "Track your progress through reports and prepare confidently for interviews.",
    icon: Briefcase,
  },
];