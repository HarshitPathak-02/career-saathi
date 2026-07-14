import { careerRoles } from '../../shared/data/career-role.js';

class CareerRoleRepository {
  findAll() {
    return careerRoles;
  }

  findByCode(code: string) {
    return careerRoles.find(
      (role) => role.code === code
    );
  }
}

export const careerRoleRepository =
  new CareerRoleRepository();