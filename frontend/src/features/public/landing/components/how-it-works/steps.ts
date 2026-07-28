import {
  ClipboardCheck,
  RefreshCw,
  Route,
  Target,
  ListChecks,
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

    title:
      "Tell Us Where You Want to Go",

    description:
      "Share your career goal, current skills, available study time, and target timeline so CareerSaathi understands where you are starting from.",

    icon:
      Target,
  },

  {
    id: 2,

    title:
      "Get Your Personalized Roadmap",

    description:
      "CareerSaathi turns your goal and current skill level into a structured learning roadmap with clear milestones and priorities.",

    icon:
      Route,
  },

  {
    id: 3,

    title:
      "Work Through Weekly Missions",

    description:
      "Your roadmap becomes focused weekly missions and daily tasks, giving you a clear answer to what you should work on today.",

    icon:
      ListChecks,
  },

  {
    id: 4,

    title:
      "Assess & Reflect Every Week",

    description:
      "At the end of each week, record your assessment results and reflect on your confidence, challenges, and learning experience.",

    icon:
      ClipboardCheck,
  },

  {
    id: 5,

    title:
      "Your Next Week Adapts to You",

    description:
      "CareerSaathi analyzes your performance, identifies areas that need revision, and uses those insights to shape your next mission.",

    icon:
      RefreshCw,
  },

];