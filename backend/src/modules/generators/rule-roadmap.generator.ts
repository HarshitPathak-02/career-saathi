import { ResourceType } from "../roadmaps/roadmap.enums.js";
import { GeneratedRoadmap, RoadmapGenerationInput } from "../roadmaps/roadmap.types.js";
import { TaskType, CompletionType } from "../task/task.enums.js"; // Ensure this path matches your project structure
import { RoadmapGenerator } from "./roadmap-generator.interface.js";

export class RuleRoadmapGenerator
    implements RoadmapGenerator {

    async generate(
        input: RoadmapGenerationInput
    ): Promise<GeneratedRoadmap> {
        return {
            title: 'Backend Developer Roadmap',
            description: 'A rule-based roadmap to become a Backend Developer.',
            phases: [
                {
                    title: 'JavaScript Fundamentals',
                    description: 'Build a strong foundation in JavaScript before moving to backend technologies.',
                    order: 1,
                    estimatedWeeks: 2,
                    missions: [
                        {
                            title: 'Variables and Data Types',
                            description: 'Learn JavaScript variables, data types, and basic syntax.',
                            order: 1,
                            tasks: [
                                {
                                    title: 'Understand JavaScript Variables',
                                    description: 'Study variable declarations and primitive data types.',
                                    order: 1,
                                    estimatedHours: 2,
                                    taskType: TaskType.READING, // Added as per GeneratedTask interface
                                    completionType: CompletionType.MANUAL, // Added as per GeneratedTask interface
                                    resources: [
                                        {
                                            type: ResourceType.DOCUMENTATION,
                                            title: 'MDN JavaScript Variables',
                                            url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types',
                                            platform: 'MDN',
                                            estimatedMinutes: 60,
                                        },
                                        {
                                            type: ResourceType.VIDEO,
                                            title: 'JavaScript Variables Tutorial',
                                            url: 'https://www.youtube.com/',
                                            platform: 'YouTube',
                                            estimatedMinutes: 45,
                                        },
                                        {
                                            type: ResourceType.CODING,
                                            title: 'Practice Variables',
                                            platform: 'Career Companion',
                                            estimatedMinutes: 30,
                                        },
                                    ],
                                    optional: false,
                                },
                                {
                                    title: 'Build a Variable Practice Program',
                                    description: 'Write small JavaScript programs using variables and data types.',
                                    order: 2,
                                    estimatedHours: 1,
                                    taskType: TaskType.PRACTICE, // Added as per GeneratedTask interface
                                    completionType: CompletionType.SELF, // Added as per GeneratedTask interface
                                    resources: [
                                        {
                                            type: ResourceType.PROJECT,
                                            title: 'Variable Practice Project',
                                            platform: 'Career Companion',
                                            estimatedMinutes: 60,
                                        },
                                    ],
                                    optional: false,
                                },
                            ],
                        },
                    ],
                },
            ],
        };
    }
}
