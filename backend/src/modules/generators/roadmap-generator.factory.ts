import { RuleRoadmapGenerator } from "./rule-roadmap.generator.js";

export class RoadmapGeneratorFactory {

    static create() {

        return new RuleRoadmapGenerator();
    }
}