import {
    Request,
    Response,
} from "express";

import {
    Types,
} from "mongoose";

import {
    asyncHandler,
} from "../../core/middleware/async-handler.js";

import {
    assessmentService,
} from "./assessment.service.js";

import {
    assessmentWorkflowService,
} from "./assessment-workflow.service.js";

class AssessmentController {

    /*
    |--------------------------------------------------------------------------
    | Start Initial Assessment
    |--------------------------------------------------------------------------
    */

    startInitialAssessment = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {

            const assessment =
                await assessmentWorkflowService
                    .startInitialAssessment(
                        req.body.careerJourneyId
                    );

            res.status(201).json({
                success: true,

                message:
                    "Initial assessment created successfully.",

                data: assessment,
            });
        }
    );

    /*
    |--------------------------------------------------------------------------
    | Start Weekly Assessment
    |--------------------------------------------------------------------------
    */

    startWeeklyAssessment = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {

            const assessment =
                await assessmentWorkflowService
                    .startWeeklyAssessment(
                        req.body.careerJourneyId
                    );

            res.status(201).json({
                success: true,

                message:
                    "Weekly assessment created successfully.",

                data: assessment,
            });
        }
    );

    /*
    |--------------------------------------------------------------------------
    | Submit Initial Assessment
    |--------------------------------------------------------------------------
    */

    submitInitialAssessment = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {

            const assessment =
                await assessmentWorkflowService
                    .completeInitialAssessment(
                        req.body
                    );

            res.status(200).json({
                success: true,

                message:
                    "Initial assessment submitted successfully.",

                data: assessment,
            });
        }
    );

    /*
    |--------------------------------------------------------------------------
    | Submit Weekly Assessment
    |--------------------------------------------------------------------------
    */

    submitWeeklyAssessment = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {

            const assessment =
                await assessmentWorkflowService
                    .completeWeeklyAssessment(
                        req.body
                    );

            res.status(200).json({
                success: true,

                message:
                    "Weekly assessment submitted successfully.",

                data: assessment,
            });
        }
    );

    /*
    |--------------------------------------------------------------------------
    | Assessment History
    |--------------------------------------------------------------------------
    */

    getAssessmentHistory = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {

            const {
                careerJourneyId,
            } = req.params as {
                careerJourneyId: string;
            };

            const assessments =
                await assessmentService
                    .getAssessmentHistory(
                        new Types.ObjectId(
                            careerJourneyId
                        )
                    );

            res.status(200).json({
                success: true,

                message:
                    "Assessment history fetched successfully.",

                data: assessments,
            });
        }
    );

    /*
    |--------------------------------------------------------------------------
    | Assessment Details
    |--------------------------------------------------------------------------
    */

    getAssessmentDetails = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {

            const {
                assessmentId,
            } = req.params as {
                assessmentId: string;
            };

            const assessment =
                await assessmentService
                    .getAssessmentDetails(
                        assessmentId
                    );

            res.status(200).json({
                success: true,

                message:
                    "Assessment details fetched successfully.",

                data: assessment,
            });
        }
    );

    /*
    |--------------------------------------------------------------------------
    | Get Assessment By Id
    |--------------------------------------------------------------------------
    */

    getAssessmentById = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {

            const {
                assessmentId,
            } = req.params as {
                assessmentId: string;
            };

            const assessment =
                await assessmentService
                    .getAssessmentById(
                        assessmentId
                    );

            res.status(200).json({
                success: true,

                data: assessment,
            });
        }
    );
}

export const assessmentController =
    new AssessmentController();