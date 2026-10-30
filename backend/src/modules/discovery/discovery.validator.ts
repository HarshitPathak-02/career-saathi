import Joi from 'joi';

import { DiscoveryAnswerType, DiscoveryCandidateSource } from './discovery.enums.js';

const objectId = Joi.string().hex().length(24).messages({
  'any.required': 'Discovery id is required.',
  'string.hex': 'Discovery id must be a valid ObjectId.',
  'string.length': 'Discovery id must be a valid ObjectId.',
});

export const startDiscoverySchema = Joi.object({
  careerJourneyId: objectId.optional(),
});

export const addDiscoveryAnswerSchema = Joi.object({
  questionKey: Joi.string().trim().min(1).max(200).required(),
  answer: Joi.string().trim().min(1).max(5000).required(),
  answerType: Joi.string()
    .valid(...Object.values(DiscoveryAnswerType))
    .required(),
});

export const createDiscoveryCandidateSchema = Joi.object({
  careerDomainId: objectId.required(),
  careerRoleId: objectId.required(),
  rationale: Joi.string().trim().max(1000).optional(),
  source: Joi.string()
    .valid(...Object.values(DiscoveryCandidateSource))
    .required(),
  rank: Joi.number().integer().min(1).required(),
});

export const discoveryIdParamSchema = Joi.object({
  discoveryId: objectId.required(),
});

export const discoveryCandidateParamSchema = Joi.object({
  discoveryId: objectId.required(),
  candidateId: objectId.required(),
});
