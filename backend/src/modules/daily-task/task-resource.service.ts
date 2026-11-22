import { TaskResource } from "./daily-task.types.js";
import { TaskResourceType } from "./daily-task.enums.js";
import { DailyTaskOutput } from "./daily-task.types.js";
import { RoadmapItemDocument } from "../roadmap/roadmap-item.model.js";

interface CuratedResourceItem {
    keywords: string[];
    video: {
        title: string;
        url: string;
        provider: string;
        estimatedMinutes: number;
    };
    documentation: {
        title: string;
        url: string;
        provider: string;
    };
}

const CURATED_KNOWLEDGE_BASE: CuratedResourceItem[] = [
    {
        keywords: ["html", "semantic", "tag", "markup", "web fundamentals"],
        video: {
            title: "HTML5 Crash Course for Beginners",
            url: "https://www.youtube.com/watch?v=UB1O30fR-EE",
            provider: "Traversy Media",
            estimatedMinutes: 30,
        },
        documentation: {
            title: "MDN Web Docs: HTML Elements & Structure",
            url: "https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML",
            provider: "MDN Web Docs",
        },
    },
    {
        keywords: ["css", "style", "flexbox", "grid", "responsive", "box model", "tailwind"],
        video: {
            title: "CSS & Flexbox/Grid Modern Complete Guide",
            url: "https://www.youtube.com/watch?v=1PnVor36_40",
            provider: "FreeCodeCamp",
            estimatedMinutes: 45,
        },
        documentation: {
            title: "MDN Web Docs: CSS Fundamentals & Layouts",
            url: "https://developer.mozilla.org/en-US/docs/Learn/CSS",
            provider: "MDN Web Docs",
        },
    },
    {
        keywords: ["javascript", "js", "async", "promise", "es6", "dom", "closure", "event loop"],
        video: {
            title: "JavaScript Full Crash Course & Modern ES6+",
            url: "https://www.youtube.com/watch?v=hdI2bqOjy3c",
            provider: "Traversy Media",
            estimatedMinutes: 45,
        },
        documentation: {
            title: "MDN JavaScript Guide & Modern Syntax",
            url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
            provider: "MDN Web Docs",
        },
    },
    {
        keywords: ["react", "component", "hook", "useeffect", "usestate", "props", "jsx", "state"],
        video: {
            title: "React.js Complete Beginner to Advanced Tutorial",
            url: "https://www.youtube.com/watch?v=bMknfKXIFA8",
            provider: "FreeCodeCamp",
            estimatedMinutes: 50,
        },
        documentation: {
            title: "Official React Documentation: Core Concepts & Hooks",
            url: "https://react.dev/learn",
            provider: "React Docs",
        },
    },
    {
        keywords: ["node", "express", "backend", "api", "rest", "routing", "middleware", "server"],
        video: {
            title: "Node.js & Express REST API Architecture",
            url: "https://www.youtube.com/watch?v=Oe421EPjeBE",
            provider: "FreeCodeCamp",
            estimatedMinutes: 45,
        },
        documentation: {
            title: "Express.js Official Documentation & Routing Guide",
            url: "https://expressjs.com/en/guide/routing.html",
            provider: "Expressjs.com",
        },
    },
    {
        keywords: ["mongodb", "database", "mongoose", "nosql", "schema", "query", "aggregation"],
        video: {
            title: "MongoDB & Mongoose Schema Design Tutorial",
            url: "https://www.youtube.com/watch?v=DZBGEExL2LU",
            provider: "Web Dev Simplified",
            estimatedMinutes: 35,
        },
        documentation: {
            title: "MongoDB Official Manual: CRUD Operations & Indexes",
            url: "https://www.mongodb.com/docs/manual/core/databases-and-collections/",
            provider: "MongoDB Docs",
        },
    },
    {
        keywords: ["sql", "postgresql", "mysql", "join", "rdbms", "table", "relation"],
        video: {
            title: "SQL & Relational Databases Complete Guide",
            url: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
            provider: "FreeCodeCamp",
            estimatedMinutes: 40,
        },
        documentation: {
            title: "PostgreSQL Tutorial & SQL Queries Reference",
            url: "https://www.postgresqltutorial.com/",
            provider: "PostgreSQL Tutorial",
        },
    },
    {
        keywords: ["git", "github", "version control", "commit", "branch", "pull request"],
        video: {
            title: "Git and GitHub for Beginners - Full Course",
            url: "https://www.youtube.com/watch?v=RGOj5yH7evk",
            provider: "FreeCodeCamp",
            estimatedMinutes: 30,
        },
        documentation: {
            title: "Git Official Documentation & Pro Git Guide",
            url: "https://git-scm.com/doc",
            provider: "Git SCM",
        },
    },
    {
        keywords: ["typescript", "ts", "interface", "generic", "types"],
        video: {
            title: "TypeScript Full Course for Beginners",
            url: "https://www.youtube.com/watch?v=gieEQFIfgYc",
            provider: "FreeCodeCamp",
            estimatedMinutes: 40,
        },
        documentation: {
            title: "TypeScript Handbook: The Basics & Interfaces",
            url: "https://www.typescriptlang.org/docs/handbook/intro.html",
            provider: "TypeScript Lang",
        },
    },
    {
        keywords: ["docker", "container", "devops", "ci/cd", "deployment"],
        video: {
            title: "Docker Tutorial for Beginners - Full Course",
            url: "https://www.youtube.com/watch?v=fqMOX6JJhGo",
            provider: "TechWorld with Nana",
            estimatedMinutes: 45,
        },
        documentation: {
            title: "Docker Get Started Guide & Best Practices",
            url: "https://docs.docker.com/get-started/",
            provider: "Docker Docs",
        },
    },
    {
        keywords: ["algorithm", "dsa", "data structure", "array", "tree", "graph", "binary search"],
        video: {
            title: "Data Structures and Algorithms for Beginners",
            url: "https://www.youtube.com/watch?v=8hly31xKli0",
            provider: "FreeCodeCamp",
            estimatedMinutes: 60,
        },
        documentation: {
            title: "GeeksforGeeks Data Structures & Algorithms Roadmap",
            url: "https://www.geeksforgeeks.org/learn-data-structures-and-algorithms-dsa-tutorial/",
            provider: "GeeksforGeeks",
        },
    },
];

class TaskResourceService {

    /**
     * Resolves high quality learning resources for a given daily task.
     * Combines YouTube video, Documentation, CareerSaathi self-made PDF/notes,
     * and a partner tutor resource slot (for monetization).
     */
    resolveResourcesForTask(
        task: DailyTaskOutput,
        roadmapItems?: RoadmapItemDocument[]
    ): TaskResource[] {

        if (task.dayNumber === 7) {
            return this.getWeeklyReviewResources();
        }

        const taskText = `${task.title} ${(task.topics || []).join(" ")} ${task.description || ""}`.toLowerCase();

        // 1. Check curated knowledge base for best keyword match
        const match = CURATED_KNOWLEDGE_BASE.find(item =>
            item.keywords.some(kw => taskText.includes(kw))
        );

        const resources: TaskResource[] = [];

        // 1. YouTube Video Resource
        if (match) {
            resources.push({
                title: match.video.title,
                url: match.video.url,
                type: TaskResourceType.VIDEO,
                provider: match.video.provider,
                description: `Watch this focused video tutorial covering the core concepts of ${task.title}.`,
                estimatedMinutes: match.video.estimatedMinutes,
            });
        } else {
            const query = encodeURIComponent(`${task.title} tutorial`);
            resources.push({
                title: `${task.title} - Video Masterclass`,
                url: `https://www.youtube.com/results?search_query=${query}`,
                type: TaskResourceType.VIDEO,
                provider: "YouTube Learning",
                description: `Curated video walkthrough and problem-solving tutorial for ${task.title}.`,
                estimatedMinutes: 30,
            });
        }

        // 2. Official Documentation / Reference
        if (match) {
            resources.push({
                title: match.documentation.title,
                url: match.documentation.url,
                type: TaskResourceType.DOCUMENTATION,
                provider: match.documentation.provider,
                description: "Authoritative reference and interactive documentation.",
                estimatedMinutes: 20,
            });
        } else {
            resources.push({
                title: `${task.title} - Documentation & Syntax Reference`,
                url: `https://devdocs.io/#q=${encodeURIComponent(task.title)}`,
                type: TaskResourceType.DOCUMENTATION,
                provider: "DevDocs Reference",
                description: "Comprehensive documentation and syntax guide.",
                estimatedMinutes: 20,
            });
        }

        // 3. CareerSaathi Team PDF / Cheatsheet / Notes (Self-made academic materials)
        const slug = task.title.toLowerCase().replace(/[^a-z0-9]/g, "-");
        resources.push({
            title: `CareerSaathi Quick Notes: ${task.title}`,
            url: `https://careersaathi.in/resources/notes/${slug}.pdf`,
            type: TaskResourceType.PDF,
            provider: "CareerSaathi Academic Team",
            isCareerSaathiOfficial: true,
            description: "Self-made revision notes, formula sheets, and key summary points crafted by CareerSaathi mentors.",
            estimatedMinutes: 15,
        });

        // 4. Partner Tutor / Coaching Institute Resource (Ready for Tutor Monetization)
        resources.push({
            title: `Expert Live Practice & Doubt Session: ${task.title}`,
            url: "https://careersaathi.in/partner-coaching",
            type: TaskResourceType.COURSE,
            provider: "CareerSaathi Verified Partner",
            isPartner: true,
            partnerName: "Top Institute / Tutor Partner",
            description: "Deep dive problem-solving session and live mentor guidance from our accredited coaching partners.",
            estimatedMinutes: 45,
        });

        return resources;
    }

    /**
     * Specialized resources for Day 7 (Weekly Review & Assessment day)
     */
    getWeeklyReviewResources(): TaskResource[] {
        return [
            {
                title: "CareerSaathi Weekly Synthesis & Revision Guide",
                url: "https://careersaathi.in/resources/weekly-review-guide.pdf",
                type: TaskResourceType.PDF,
                provider: "CareerSaathi Academic Team",
                isCareerSaathiOfficial: true,
                description: "Comprehensive revision pack summarizing this week's milestone concepts and formula sheets.",
                estimatedMinutes: 30,
            },
            {
                title: "Weekly Assessment Strategy & Mock Drills",
                url: "https://careersaathi.in/assessment/mock-prep",
                type: TaskResourceType.PRACTICE,
                provider: "CareerSaathi Assessment Engine",
                isCareerSaathiOfficial: true,
                description: "Practice questions and self-evaluation guidelines before beginning your weekly review assessment.",
                estimatedMinutes: 45,
            },
            {
                title: "Partner Coaching: Weekly Doubt Clearing Masterclass",
                url: "https://careersaathi.in/partner-coaching/weekly-doubt",
                type: TaskResourceType.COURSE,
                provider: "CareerSaathi Verified Partner",
                isPartner: true,
                partnerName: "Elite Tutor Network",
                description: "Interactive session addressing top doubts, edge cases, and industry coding patterns.",
                estimatedMinutes: 60,
            },
        ];
    }

    /**
     * Enriches an array of generated daily tasks with resources
     */
    enrichTasksWithResources(
        tasks: DailyTaskOutput[],
        roadmapItems?: RoadmapItemDocument[]
    ): DailyTaskOutput[] {
        return tasks.map(task => {
            const existingResources = task.resources || [];
            if (existingResources.length > 0) {
                return task;
            }

            const generatedResources = this.resolveResourcesForTask(task, roadmapItems);
            return {
                ...task,
                resources: generatedResources,
            };
        });
    }
}

export const taskResourceService = new TaskResourceService();
