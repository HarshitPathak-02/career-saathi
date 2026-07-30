import Joi from "joi";


export const evaluateReadinessParamsSchema =
    Joi.object({

        careerJourneyId:
            Joi.string()
                .hex()
                .length(24)
                .required(),

    });