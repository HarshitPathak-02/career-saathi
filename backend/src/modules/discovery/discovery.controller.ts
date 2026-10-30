import { Request, Response } from 'express';

import { asyncHandler } from '../../core/middleware/async-handler.js';
import { successResponse } from '../../core/responses/successResponse.js';
import { HTTP_STATUS } from '../../core/constants/http-status.constants.js';
import { getAuthUser } from '../../shared/utils/get-auth-user.js';
import { discoveryService } from './discovery.service.js';
import {
  CreateDiscoveryAnswerDto,
  CreateDiscoveryCandidateDto,
  CreateDiscoverySessionDto,
} from './discovery.types.js';
import { discoveryMapper } from './discovery.mapper.js';

class DiscoveryController {
  startDiscovery = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthUser(req);
    const body = req.body as CreateDiscoverySessionDto;

    const session = await discoveryService.createDiscoverySession(
      user.userId,
      body.careerJourneyId
    );

    return successResponse({
      res,
      statusCode: HTTP_STATUS.CREATED,
      message: 'Career discovery started successfully.',
      data: discoveryMapper.toDiscoverySessionResponse(session),
    });
  });

  getLatestDiscovery = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthUser(req);

    const session = await discoveryService.getLatestDiscoverySession(user.userId);

    return successResponse({
      res,
      statusCode: HTTP_STATUS.OK,
      message: session ? 'Career discovery fetched successfully.' : 'No career discovery found.',
      data: session ? discoveryMapper.toDiscoverySessionResponse(session) : null,
    });
  });

  getDiscovery = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthUser(req);
    const { discoveryId } = req.params as { discoveryId: string };

    const session = await discoveryService.getDiscoverySession(user.userId, discoveryId);

    return successResponse({
      res,
      statusCode: HTTP_STATUS.OK,
      message: 'Career discovery fetched successfully.',
      data: discoveryMapper.toDiscoverySessionResponse(session),
    });
  });

  addDiscoveryAnswer = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthUser(req);
    const { discoveryId } = req.params as { discoveryId: string };
    const body = req.body as CreateDiscoveryAnswerDto;

    const answer = await discoveryService.addDiscoveryAnswer(user.userId, discoveryId, body);

    return successResponse({
      res,
      statusCode: HTTP_STATUS.CREATED,
      message: 'Career discovery answer added successfully.',
      data: discoveryMapper.toDiscoveryAnswerResponse(answer),
    });
  });

  generateDiscoveryCandidates = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthUser(req);
    const { discoveryId } = req.params as { discoveryId: string };

    const session = await discoveryService.generateDiscoveryCandidates(user.userId, discoveryId);

    return successResponse({
      res,
      statusCode: HTTP_STATUS.OK,
      message: 'Career discovery recommendations generated successfully.',
      data: discoveryMapper.toDiscoverySessionResponse(session),
    });
  });

  getDiscoveryMessages = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthUser(req);
    const { discoveryId } = req.params as { discoveryId: string };

    const messages = await discoveryService.getDiscoveryMessages(user.userId, discoveryId);

    return successResponse({
      res,
      statusCode: HTTP_STATUS.OK,
      message: 'Career discovery messages fetched successfully.',
      data: messages,
    });
  });

  getDiscoveryCandidates = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthUser(req);
    const { discoveryId } = req.params as { discoveryId: string };

    const candidates = await discoveryService.getDiscoveryCandidates(user.userId, discoveryId);

    return successResponse({
      res,
      statusCode: HTTP_STATUS.OK,
      message: 'Career discovery candidates fetched successfully.',
      data: candidates,
    });
  });

  createDiscoveryCandidate = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthUser(req);
    const { discoveryId } = req.params as { discoveryId: string };
    const body = req.body as CreateDiscoveryCandidateDto;

    const candidate = await discoveryService.createDiscoveryCandidate(
      user.userId,
      discoveryId,
      body
    );

    return successResponse({
      res,
      statusCode: HTTP_STATUS.CREATED,
      message: 'Career discovery candidate created successfully.',
      data: candidate,
    });
  });

  selectDiscoveryCandidate = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthUser(req);
    const { discoveryId, candidateId } = req.params as {
      discoveryId: string;
      candidateId: string;
    };

    const selection = await discoveryService.selectDiscoveryCandidate(
      user.userId,
      discoveryId,
      candidateId
    );

    return successResponse({
      res,
      statusCode: HTTP_STATUS.OK,
      message: 'Career direction selected successfully.',
      data: selection,
    });
  });
}

export const discoveryController = new DiscoveryController();
