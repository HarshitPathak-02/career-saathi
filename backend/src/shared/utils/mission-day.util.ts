const MILLISECONDS_PER_DAY =
    1000 * 60 * 60 * 24;

export function getMissionDay(
    startDate: Date,
    currentDate: Date = new Date()
): number {

    const diffInDays = Math.floor(
        (
            currentDate.getTime() -
            startDate.getTime()
        ) / MILLISECONDS_PER_DAY
    );

    return Math.min(
        Math.max(diffInDays + 1, 1),
        7
    );

}

export function isReviewDay(
    startDate: Date,
    currentDate: Date = new Date()
): boolean {

    return (
        getMissionDay(
            startDate,
            currentDate
        ) === 7
    );

}