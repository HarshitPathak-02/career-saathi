import {
    RoadmapGenerationInput,
    GeneratedRoadmap,
} from '../roadmaps/roadmap.types.js';

export interface RoadmapGenerator {

    generate(

        input: RoadmapGenerationInput

    ): Promise<GeneratedRoadmap>;
}