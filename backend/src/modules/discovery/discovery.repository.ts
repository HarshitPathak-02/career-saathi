import { ClientSession, Types } from 'mongoose';

import {
  CreateDiscoveryAnswerInput,
  CreateDiscoveryCandidateDto,
  CreateDiscoveryMessageInput,
  CreateDiscoverySessionInput,
} from './discovery.types.js';
import { DiscoveryAnswerModel } from './discovery.model.js';
import { DiscoveryCandidateModel } from './discovery.model.js';
import { DiscoveryMessageModel } from './discovery.model.js';
import { DiscoverySessionModel } from './discovery.model.js';
import { DiscoveryCandidateStatus } from './discovery.enums.js';

class DiscoverySessionRepository {
  async create(input: CreateDiscoverySessionInput, session?: ClientSession) {
    const [created] = await DiscoverySessionModel.create([input], { session });
    return created;
  }

  async findById(id: Types.ObjectId, session?: ClientSession) {
    return DiscoverySessionModel.findById(id).session(session ?? null);
  }

  async findByIdAndUserId(id: Types.ObjectId, userId: Types.ObjectId, session?: ClientSession) {
    return DiscoverySessionModel.findOne({ _id: id, userId }).session(session ?? null);
  }

  async findByUserId(userId: Types.ObjectId, session?: ClientSession) {
    return DiscoverySessionModel.find({ userId })
      .sort({ createdAt: -1 })
      .session(session ?? null);
  }

  async findLatestByUserId(userId: Types.ObjectId, session?: ClientSession) {
    return DiscoverySessionModel.findOne({ userId })
      .sort({ createdAt: -1 })
      .session(session ?? null);
  }
}

class DiscoveryMessageRepository {
  async create(input: CreateDiscoveryMessageInput, session?: ClientSession) {
    const [message] = await DiscoveryMessageModel.create([input], { session });
    return message;
  }

  async findByDiscoverySessionId(id: Types.ObjectId, session?: ClientSession) {
    return DiscoveryMessageModel.find({ discoverySessionId: id })
      .sort({ createdAt: 1 })
      .session(session ?? null);
  }

  async findRecentByDiscoverySessionId(id: Types.ObjectId, limit: number, session?: ClientSession) {
    return DiscoveryMessageModel.find({ discoverySessionId: id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .session(session ?? null);
  }
}

class DiscoveryAnswerRepository {
  async create(input: CreateDiscoveryAnswerInput, session?: ClientSession) {
    const [answer] = await DiscoveryAnswerModel.create([input], { session });
    return answer;
  }

  async findByDiscoverySessionId(id: Types.ObjectId, session?: ClientSession) {
    return DiscoveryAnswerModel.find({ discoverySessionId: id })
      .sort({ createdAt: 1 })
      .session(session ?? null);
  }

  async countByDiscoverySessionId(id: Types.ObjectId, session?: ClientSession) {
    return DiscoveryAnswerModel.countDocuments({ discoverySessionId: id }).session(session ?? null);
  }
}

class DiscoveryCandidateRepository {
  async create(input: CreateDiscoveryCandidateDto, session?: ClientSession) {
    const [candidate] = await DiscoveryCandidateModel.create([input], { session });
    return candidate;
  }

  async createMany(inputs: CreateDiscoveryCandidateDto[], session?: ClientSession) {
    return DiscoveryCandidateModel.create(inputs, { session, ordered: true });
  }

  async deleteByDiscoverySessionId(id: Types.ObjectId, session?: ClientSession) {
    return DiscoveryCandidateModel.deleteMany({ discoverySessionId: id }).session(session ?? null);
  }

  async findByDiscoverySessionId(id: Types.ObjectId, session?: ClientSession) {
    return DiscoveryCandidateModel.find({ discoverySessionId: id })
      .sort({ rank: 1 })
      .session(session ?? null);
  }

  async findByIdAndDiscoverySessionId(
    id: Types.ObjectId,
    discoverySessionId: Types.ObjectId,
    session?: ClientSession
  ) {
    return DiscoveryCandidateModel.findOne({ _id: id, discoverySessionId }).session(
      session ?? null
    );
  }

  async updateStatusById(
    id: Types.ObjectId,
    status: DiscoveryCandidateStatus,
    session?: ClientSession
  ) {
    return DiscoveryCandidateModel.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true, runValidators: true, session }
    );
  }

  async rejectOtherCandidates(
    discoverySessionId: Types.ObjectId,
    selectedCandidateId: Types.ObjectId,
    session?: ClientSession
  ) {
    return DiscoveryCandidateModel.updateMany(
      {
        discoverySessionId,
        _id: { $ne: selectedCandidateId },
        status: { $ne: DiscoveryCandidateStatus.REJECTED },
      },
      { $set: { status: DiscoveryCandidateStatus.REJECTED } },
      { session }
    );
  }
}

export const discoverySessionRepository = new DiscoverySessionRepository();
export const discoveryMessageRepository = new DiscoveryMessageRepository();
export const discoveryAnswerRepository = new DiscoveryAnswerRepository();
export const discoveryCandidateRepository = new DiscoveryCandidateRepository();
