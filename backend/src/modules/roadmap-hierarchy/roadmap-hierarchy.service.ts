import { ClientSession } from 'mongoose';

import { GeneratedRoadmap } from '../roadmaps/roadmap.types.js';

import { roadmapPhaseService } from '../roadmap-phase/roadmap-phase.service.js';
import { missionService } from '../mission/mission.service.js';
import { taskService } from '../task/task.service.js';

class RoadmapHierarchyService {

    async build(
        userId: string,
        roadmapId: string,
        generated: GeneratedRoadmap,
        session: ClientSession
    ): Promise<void> {

        const phases =
            await roadmapPhaseService.createFromGeneratedPhases(
                userId,
                roadmapId,
                generated.phases,
                session
            );

        console.log("Created phases:", phases.length);
        console.log(phases);

        for (let i = 0; i < phases.length; i++) {

            const missions =
                await missionService.createFromGeneratedMissions(
                    userId,
                    roadmapId,
                    phases[i].id,
                    generated.phases[i].missions,
                    session
                );

            console.log("Created missions:", missions.length);
            console.log(missions);

            for (let j = 0; j < missions.length; j++) {

                await taskService.createFromGeneratedTasks(
                    userId,
                    roadmapId,
                    phases[i].id,
                    missions[j].id,
                    generated.phases[i].missions[j].tasks,
                    session
                );
            }
        }

        await roadmapPhaseService.unlockFirstPhase(
            roadmapId,
            session
        );

        if (phases.length > 0) {

            const firstMission =
                await missionService.unlockFirstMission(
                    phases[0].id,
                    session
                );

            await taskService.unlockFirstTask(
                firstMission.id,
                session
            );
        }
    }
}

export const roadmapHierarchyService =
    new RoadmapHierarchyService();