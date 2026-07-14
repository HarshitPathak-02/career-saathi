import { GeneratedRoadmap } from "../roadmaps/roadmap.types.js";
import { RoadmapGenerator } from "./roadmap-generator.interface.js";

export class AiRoadmapGenerator
    implements RoadmapGenerator {

    async generate(): Promise<GeneratedRoadmap> {

        throw new Error(
            'AI roadmap generation not implemented.'
        );
    }
}