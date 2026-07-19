import Joi from "joi";

const objectId = Joi.string().hex().length(24);

export const initializeUserSkillsBodyValidator = Joi.object({
    selectedSkillCatalogIds: Joi.array()
        .items(objectId)
        .required(),
});

export const careerJourneyIdParamsValidator = Joi.object({
    careerJourneyId: objectId.required(),
});

export const updateSelectedSkillsBodyValidator = Joi.object({
    selectedSkillCatalogIds: Joi.array()
        .items(objectId)
        .required(),
});