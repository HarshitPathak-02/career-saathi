export interface WeekRange {

    weekStart: Date;

    weekEnd: Date;
}

export function getCurrentWeekRange(): WeekRange {

    const today = new Date();

    const currentDay = today.getDay();

    // Monday = first day of week
    const daysSinceMonday =
        currentDay === 0
            ? 6
            : currentDay - 1;

    const weekStart = new Date(today);

    weekStart.setDate(
        today.getDate() - daysSinceMonday
    );

    weekStart.setHours(
        0,
        0,
        0,
        0
    );

    const weekEnd = new Date(weekStart);

    weekEnd.setDate(
        weekStart.getDate() + 6
    );

    weekEnd.setHours(
        23,
        59,
        59,
        999
    );

    return {

        weekStart,

        weekEnd,
    };
}