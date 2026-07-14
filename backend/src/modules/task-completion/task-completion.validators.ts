import { z } from 'zod';

import { CompletionType } from '../task/task.enums.js';

export const completeTaskSchema =
    z.object({


        githubUrl:

            z.string()

                .url()

                .optional(),

        score:

            z.number()

                .min(0)

                .max(100)

                .optional(),
    });