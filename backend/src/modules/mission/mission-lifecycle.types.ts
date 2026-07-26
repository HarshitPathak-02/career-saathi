import {
    MissionDocument,
} from "./mission.schema.js";

export enum MissionLifecycleState {

    ACTIVE =
    "ACTIVE",

    INITIAL_MISSION_REQUIRED =
    "INITIAL_MISSION_REQUIRED",

    WAITING_FOR_NEXT_MISSION =
    "WAITING_FOR_NEXT_MISSION",

    ROADMAP_COMPLETED =
    "ROADMAP_COMPLETED",

}

export interface MissionLifecycleResult {

    state:
    MissionLifecycleState;

    mission:
    MissionDocument | null;

    nextMissionAvailableAt:
    Date | null;

}