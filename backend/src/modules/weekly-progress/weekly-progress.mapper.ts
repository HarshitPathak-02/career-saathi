import {
    WeeklyProgressResponse,
} from './weekly-progress.types.js';

export function toWeeklyProgressResponse(
    data: WeeklyProgressResponse
): WeeklyProgressResponse {

    return {
        ...data,
    };
}