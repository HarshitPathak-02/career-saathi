export const startOfDay = (
    date: Date
): Date => {

    const result =
        new Date(date);

    result.setHours(
        0,
        0,
        0,
        0
    );

    return result;
};


export const endOfDay = (
    date: Date
): Date => {

    const result =
        new Date(date);

    result.setHours(
        23,
        59,
        59,
        999
    );

    return result;
};


export const addDays = (
    date: Date,
    days: number
): Date => {

    const result =
        new Date(date);

    result.setDate(
        result.getDate() +
        days
    );

    return result;
};


export const differenceInCalendarDays = (
    laterDate: Date,
    earlierDate: Date
): number => {

    const later =
        startOfDay(
            laterDate
        );

    const earlier =
        startOfDay(
            earlierDate
        );

    const millisecondsPerDay =
        24 * 60 * 60 * 1000;

    return Math.floor(
        (
            later.getTime() -
            earlier.getTime()
        ) /
        millisecondsPerDay
    );
};