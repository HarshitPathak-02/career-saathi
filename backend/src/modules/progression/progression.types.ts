export enum ProgressionEntityType {
    TASK = 'TASK',

    MISSION = 'MISSION',

    ROADMAP_PHASE = 'ROADMAP_PHASE',
}

export interface CompleteProgressionInput {

    entityType:
        ProgressionEntityType;

    entityId:
        string;
}