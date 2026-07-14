import { Request, Response } from 'express';

import { asyncHandler } from '../../core/middleware/async-handler.js';

import { careerRoleService } from './career-role.service.js';
import { HTTP_STATUS } from '../../core/constants/http-status.constants.js';

class CareerRoleController {
  findAll = asyncHandler(
    async (_req: Request, res: Response) => {
      const roles =
        careerRoleService.findAll();

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