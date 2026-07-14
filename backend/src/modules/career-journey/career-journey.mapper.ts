import {
  CareerJourneyDocument,
  CareerJourneyResponse,
} from './career-journey.types.js';

export const toCareerJourneyResponse = (
  journey: CareerJourneyDocument
): CareerJourneyResponse => ({
  id: journey.id,

  title: journey.title,

  careerContext: journey.careerContext,

  status: journey.status,

  createdAt: journey.createdAt,

  updatedAt: journey.updatedAt,
});