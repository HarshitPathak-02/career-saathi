import {
    z,
} from 'zod';

export const completeTaskSchema =
    z.object({

        githubUrl:
            z.string()
                .url()
                .optional(),

    });