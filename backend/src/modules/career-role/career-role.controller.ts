import { Request, Response } from 'express';

import { asyncHandler } from '../../core/middleware/async-handler.js';

import { careerRoleService } from './career-role.service.js';
import { HTTP_STATUS } from '../../core/constants/http-status.constants.js';
import { successResponse } from '../../core/responses/successResponse.js';
import { CAREER_ROLE_MESSAGES } from './career-role.constants.js';

class CareerRoleController {
  findAll = asyncHandler(
    async (_req: Request, res: Response) => {
      const roles =
        careerRoleService.findAll();

        successResponse({
          res,
          statusCode: HTTP_STATUS.OK,
          message: CAREER_ROLE_MESSAGES.FOUND,
          data: roles
        })
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: roles,
      });
    }
  );

  findByCode = asyncHandler(
    async (req: Request, res: Response) => {
      const role =
        careerRoleService.findByCode(
          req.params.code as string
        );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: role,
      });
    }
  );
}

export const careerRoleController =
  new CareerRoleController();