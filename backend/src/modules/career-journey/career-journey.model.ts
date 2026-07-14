import { Schema, model } from 'mongoose';

import {
  ICareerJourney,
  CareerJourneyDocument,
} from './career-journey.types.js';

import {
  CareerJourneyStatus,
  CurrentLevel,
  DurationUnit,
} from './career-journey.enums.js';

const careerJourneySchema =
  new Schema<ICareerJourney>(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
      },

      title: {
        type: String,
        required: true,
        trim: true,
      },

      careerContext: {
        domain: {
          type: String,
          required: true,
          trim: true,
        },

        goal: {
          type: String,
          required: true,
          trim: true,
        },

        careerRoleCode: {
          type: String,
          required: true,
          trim: true,
        },

        currentLevel: {
          type: String,
          enum: Object.values(CurrentLevel),
          required: true,
        },

        targetDuration: {
          value: {
            type: Number,
            required: true,
            min: 1,
          },

          unit: {
            type: String,
            enum: Object.values(DurationUnit),
            required: true,
          },
        },

        dailyAvailability: {
          type: Number,
          required: true,
          min: 1,
          max: 24,
        },
      },

      status: {
        type: String,
        enum: Object.values(
          CareerJourneyStatus
        ),
        default:
          CareerJourneyStatus.ACTIVE,
      },
    },
    {
      timestamps: true,
    }
  );

careerJourneySchema.index({
  userId: 1,
  status: 1,
});

export const CareerJourneyModel =
  model<ICareerJourney>(
    'CareerJourney',
    careerJourneySchema
  );

export type {
  CareerJourneyDocument,
};