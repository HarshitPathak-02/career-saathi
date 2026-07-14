import { CompletionType } from "../task/task.enums.js";

export interface CompleteTaskInput {

    taskId: string;

    completionType: CompletionType;

    githubUrl?: string;

    score?: number;
}