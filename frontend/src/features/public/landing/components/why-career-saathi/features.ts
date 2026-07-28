import {
  BarChart3,
  ClipboardCheck,
  Map,
  Target,
} from "lucide-react";

export interface Feature {

  title: string;

  description: string;

  highlight: string;

  icon: React.ElementType;

}

export const FEATURES: Feature[] = [

  {
    title:
      "A Roadmap Built Around You",

    highlight:
      "Personalized direction",

    description:
      "Your roadmap is shaped around your target role, current skills, available study time, and career timeline — not a generic list of technologies.",

    icon:
      Map,
  },

  {
    title:
      "Focused Weekly Execution",

    highlight:
      "Know what to work on",

    description:
      "CareerSaathi turns your roadmap into weekly missions and structured daily tasks so you can spend less time deciding and more time making progress.",

    icon:
      Target,
  },

  {
    title:
      "Assessment With Reflection",

    highlight:
      "Measure more than scores",

    description:
      "Every week combines skill assessment with your own reflection on confidence, difficulty, motivation, and challenges to understand how the week actually went.",

    icon:
      ClipboardCheck,
  },

  {
    title:
      "Progress That Shapes What Comes Next",

    highlight:
      "Continuously adaptive",

    description:
      "Your performance and weekly insights influence upcoming missions, helping CareerSaathi reinforce weaker areas while continuing your roadmap forward.",

    icon:
      BarChart3,
  },

];