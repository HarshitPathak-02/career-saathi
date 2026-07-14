import { careerRoleRepository } from './career-role.repository.js';

import { CAREER_ROLE_MESSAGES } from './career-role.constants.js';

import { AppError } from '../../core/errors/app-error.js';

import { HTTP_STATUS } from '../../core/constants/http-status.constants.js';

class CareerRoleService {
  findAll() {
    return careerRoleRepository.findAll();
  }

  findByCode(code: string) {
    const role =
      careerRoleRepository.findByCode(code);

    if (!role) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        CAREER_ROLE_MESSAGES.NOT_FOUND
      );
    }

    return role;
  }
}

export const careerRoleService =
  new CareerRoleService();