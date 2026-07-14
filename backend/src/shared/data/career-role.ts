import { CareerRole } from '../../modules/career-role/career-role.types.js';

export const careerRoles: CareerRole[] = [
  {
    code: 'BACKEND_DEVELOPER',

    name: 'Backend Developer',

    domain: 'Software Development',

    description:
      'Build scalable server-side applications and APIs.',

    skills: [
      {
        skillCode: 'JAVASCRIPT',
        recommendedOrder: 1,
        required: true,
        assessmentRequired: true,
      },
      {
        skillCode: 'NODE_JS',
        recommendedOrder: 2,
        required: true,
        assessmentRequired: true,
      },
      {
        skillCode: 'EXPRESS',
        recommendedOrder: 3,
        required: true,
        assessmentRequired: true,
      },
      {
        skillCode: 'MONGODB',
        recommendedOrder: 4,
        required: true,
        assessmentRequired: true,
      },
      {
        skillCode: 'GIT',
        recommendedOrder: 5,
        required: true,
        assessmentRequired: false,
      },
      {
        skillCode: 'REST_API',
        recommendedOrder: 6,
        required: true,
        assessmentRequired: true,
      },
      {
        skillCode: 'AUTHENTICATION',
        recommendedOrder: 7,
        required: true,
        assessmentRequired: true,
      },
      {
        skillCode: 'DOCKER',
        recommendedOrder: 8,
        required: false,
        assessmentRequired: false,
      },
    ],
  },
];