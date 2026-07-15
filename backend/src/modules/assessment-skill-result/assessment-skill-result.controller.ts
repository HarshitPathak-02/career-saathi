import {
    Request,
    Response,
} from 'express';

import {
    asyncHandler,
} from '../../core/middleware/async-handler.js';

import {
    successResponse,
} from '../../core/responses/successResponse.js';

import {
    getAuthUser,
} from '../../shared/utils/get-auth-user.js';

import {
    assessmentSkillResultService,
} from './assessment-skill-result.service.js';

import {
    HTTP_STATUS,
} from '../../core/constants/http-status.constants.js';

import {
    ASSESSMENT_SKILL_RESULT_MESSAGES,
} from './assessment-skill-result.constants.js';

class AssessmentSkillResultController {
    findByAssessment =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {
                const user =
                    getAuthUser(req);

                const results =
                    await assessmentSkillResultService
                        .findByAssessment(
                            req.params
                                .assessmentId as string,

                            user.userId
                        );

                return successResponse({
                    res,

                    statusCode:
                        HTTP_STATUS.OK,

                    message:
                        ASSESSMENT_SKILL_RESULT_MESSAGES
                            .FETCHED,

                    data:
                        results,
                });
            }
        );
}

export const assessmentSkillResultController =
    new AssessmentSkillResultController();