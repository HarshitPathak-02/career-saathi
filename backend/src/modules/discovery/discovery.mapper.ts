import { DiscoveryAnswerDocument } from './discovery.model.js';
import { DiscoveryCandidateDocument } from './discovery.model.js';
import { DiscoveryMessageDocument } from './discovery.model.js';
import { DiscoverySessionDocument } from './discovery.model.js';
import {
  DiscoveryAnswerResponse,
  DiscoveryCandidateResponse,
  DiscoveryMessageResponse,
  DiscoverySessionResponse,
} from './discovery.types.js';

class DiscoveryMapper {
  toDiscoverySessionResponse(session: DiscoverySessionDocument): DiscoverySessionResponse {
    return {
      id: session._id.toString(),
      userId: session.userId.toString(),
      careerJourneyId: session.careerJourneyId ? session.careerJourneyId.toString() : null,
      status: session.status,
      currentStage: session.currentStage,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      completedAt: session.completedAt ?? null,
    };
  }

  toDiscoveryMessageResponse(message: DiscoveryMessageDocument): DiscoveryMessageResponse {
    return {
      id: message._id.toString(),
      discoverySessionId: message.discoverySessionId.toString(),
      senderRole: message.senderRole,
      content: message.content,
      messageType: message.messageType,
      metadata: message.metadata,
      createdAt: message.createdAt,
    };
  }

  toDiscoveryAnswerResponse(answer: DiscoveryAnswerDocument): DiscoveryAnswerResponse {
    return {
      id: answer._id.toString(),
      discoverySessionId: answer.discoverySessionId.toString(),
      userId: answer.userId.toString(),
      questionKey: answer.questionKey,
      answer: answer.answer,
      answerType: answer.answerType,
      metadata: answer.metadata,
      createdAt: answer.createdAt,
    };
  }

  toDiscoveryCandidateResponse(
    candidate: DiscoveryCandidateDocument,
    careerDomainName = '',
    careerRoleName = ''
  ): DiscoveryCandidateResponse {
    return {
      id: candidate._id.toString(),
      discoverySessionId: candidate.discoverySessionId.toString(),
      careerDomainId: candidate.careerDomainId.toString(),
      careerDomainName,
      careerRoleId: candidate.careerRoleId.toString(),
      careerRoleName,
      rationale: candidate.rationale,
      source: candidate.source,
      rank: candidate.rank,
      status: candidate.status,
      createdAt: candidate.createdAt,
      updatedAt: candidate.updatedAt,
    };
  }
}

export const discoveryMapper = new DiscoveryMapper();
