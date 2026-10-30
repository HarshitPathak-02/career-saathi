import { HydratedDocument, InferSchemaType, Schema, model } from 'mongoose';
import { Types } from 'mongoose';

import {
  DiscoveryAnswerType,
  DiscoveryCandidateSource,
  DiscoveryCandidateStatus,
  DiscoveryMessageRole,
  DiscoveryMessageType,
  DiscoveryStage,
  DiscoveryStatus,
} from './discovery.enums.js';
import {
  DISCOVERY_ANSWERS_COLLECTION,
  DISCOVERY_CANDIDATES_COLLECTION,
  DISCOVERY_COLLECTION,
  DISCOVERY_MESSAGES_COLLECTION,
  DISCOVERY_MODEL,
} from './discovery.constants.js';

const DiscoverySessionSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    careerJourneyId: {
      type: Types.ObjectId,
      ref: 'CareerJourney',
      required: false,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(DiscoveryStatus),
      default: DiscoveryStatus.IN_PROGRESS,
      required: true,
    },
    currentStage: {
      type: String,
      enum: Object.values(DiscoveryStage),
      default: DiscoveryStage.INTRO,
      required: true,
    },
    createdAt: {
      type: Date,
      default: () => new Date(),
      required: true,
    },
    updatedAt: {
      type: Date,
      default: () => new Date(),
      required: true,
    },
    completedAt: {
      type: Date,
      default: null,
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: 'throw',
    collection: DISCOVERY_COLLECTION,
  }
);

DiscoverySessionSchema.index({
  userId: 1,
  createdAt: -1,
});

const DiscoveryMessageSchema = new Schema(
  {
    discoverySessionId: {
      type: Types.ObjectId,
      ref: 'DiscoverySession',
      required: true,
      index: true,
    },
    senderRole: {
      type: String,
      enum: Object.values(DiscoveryMessageRole),
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    messageType: {
      type: String,
      enum: Object.values(DiscoveryMessageType),
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    createdAt: {
      type: Date,
      default: () => new Date(),
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: 'throw',
    collection: DISCOVERY_MESSAGES_COLLECTION,
  }
);

DiscoveryMessageSchema.index({
  discoverySessionId: 1,
  createdAt: 1,
});

const DiscoveryAnswerSchema = new Schema(
  {
    discoverySessionId: {
      type: Types.ObjectId,
      ref: 'DiscoverySession',
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    questionKey: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
    answerType: {
      type: String,
      enum: Object.values(DiscoveryAnswerType),
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    createdAt: {
      type: Date,
      default: () => new Date(),
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: 'throw',
    collection: DISCOVERY_ANSWERS_COLLECTION,
  }
);

DiscoveryAnswerSchema.index({
  discoverySessionId: 1,
});

const DiscoveryCandidateSchema = new Schema(
  {
    discoverySessionId: {
      type: Types.ObjectId,
      ref: 'DiscoverySession',
      required: true,
      index: true,
    },
    careerDomainId: {
      type: Types.ObjectId,
      ref: 'CareerDomain',
      required: true,
      index: true,
    },
    careerRoleId: {
      type: Types.ObjectId,
      ref: 'CareerRole',
      required: true,
      index: true,
    },
    rationale: {
      type: String,
      default: '',
      trim: true,
    },
    source: {
      type: String,
      enum: Object.values(DiscoveryCandidateSource),
      default: DiscoveryCandidateSource.DISCOVERY,
      required: true,
    },
    rank: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: Object.values(DiscoveryCandidateStatus),
      default: DiscoveryCandidateStatus.PROPOSED,
      required: true,
    },
    createdAt: {
      type: Date,
      default: () => new Date(),
      required: true,
    },
    updatedAt: {
      type: Date,
      default: () => new Date(),
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: 'throw',
    collection: DISCOVERY_CANDIDATES_COLLECTION,
  }
);

DiscoveryCandidateSchema.index({
  discoverySessionId: 1,
  rank: 1,
});

export type DiscoverySession = InferSchemaType<typeof DiscoverySessionSchema>;
export type DiscoverySessionDocument = HydratedDocument<DiscoverySession>;
export type DiscoveryMessage = InferSchemaType<typeof DiscoveryMessageSchema>;
export type DiscoveryMessageDocument = HydratedDocument<DiscoveryMessage>;
export type DiscoveryAnswer = InferSchemaType<typeof DiscoveryAnswerSchema>;
export type DiscoveryAnswerDocument = HydratedDocument<DiscoveryAnswer>;
export type DiscoveryCandidate = InferSchemaType<typeof DiscoveryCandidateSchema>;
export type DiscoveryCandidateDocument = HydratedDocument<DiscoveryCandidate>;

export const DiscoverySessionModel = model<DiscoverySession>(
  DISCOVERY_MODEL,
  DiscoverySessionSchema
);
export const DiscoveryMessageModel = model<DiscoveryMessage>(
  DISCOVERY_MESSAGES_COLLECTION,
  DiscoveryMessageSchema
);
export const DiscoveryAnswerModel = model<DiscoveryAnswer>(
  DISCOVERY_ANSWERS_COLLECTION,
  DiscoveryAnswerSchema
);
export const DiscoveryCandidateModel = model<DiscoveryCandidate>(
  DISCOVERY_CANDIDATES_COLLECTION,
  DiscoveryCandidateSchema
);
