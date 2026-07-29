import Joi from "joi";

const objectIdSchema =
    Joi.string()
        .hex()
        .length(24);

export const initializeUserSkillsBodyValidator =
    Joi.object({
        selectedSkillCatalogIds:
            Joi.array()
                .items(
                    objectIdSchema.required()
                )
                .unique()
                .required(),
    });

export const careerJourneyIdParamsValidator =
    Joi.object({
        careerJourneyId:
            objectIdSchema.required(),
    });

export const updateSelectedSkillsBodyValidator =
    Joi.object({
        selectedSkillCatalogIds:
            Joi.array()
                .items(
                    objectIdSchema.required()
                )
                .unique()
                .required(),
    });