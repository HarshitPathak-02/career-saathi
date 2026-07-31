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
        new Date(
            laterDate.getFullYear(),
            laterDate.getMonth(),
            laterDate.getDate()
        );

    const earlier =
        new Date(
            earlierDate.getFullYear(),
            earlierDate.getMonth(),
            earlierDate.getDate()
        );

    const millisecondsPerDay =
        24 * 60 * 60 * 1000;

    return Math.round(
        (
            later.getTime() -
            earlier.getTime()
        ) /
        millisecondsPerDay
    );
};