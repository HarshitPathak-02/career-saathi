import {
    Types,
} from "mongoose";

import {
    MockInterviewStatus,
    MockInterviewType,
} from "./mock-interview.enums.js";


/*
|--------------------------------------------------------------------------
| Create Mock Interview DTO
|--------------------------------------------------------------------------
*/

export interface CreateMockInterviewDTO {

    careerJourneyId:
    string;

    platform:
    string;

    interviewType:
    MockInterviewType;

    overallScore:
    number;

    technicalScore:
    number;

    problemSolvingScore:
    number;

    communicationScore:
    number;

    feedback?:
    string;

    interviewedAt:
    Date;
}


/*
|--------------------------------------------------------------------------
| Create Mock Interview Input
|--------------------------------------------------------------------------
*/

export interface CreateMockInterviewInput {

    careerJourneyId:
    Types.ObjectId;

    roadmapId: Types.ObjectId;

    interviewNumber:
    number;

    platform:
    string;

    interviewType:
    MockInterviewType;

    overallScore:
    number;

    technicalScore:
    number;

    problemSolvingScore:
    number;

    communicationScore:
    number;

    feedback?:
    string;

    interviewedAt:
    Date;

    status:
    MockInterviewStatus;
}


/*
|--------------------------------------------------------------------------
| Response
|--------------------------------------------------------------------------
*/

export interface MockInterviewResponse {

    id:
    string;

    careerJourneyId:
    string;

    interviewNumber:
    number;

    platform:
    string;

    interviewType:
    MockInterviewType;

    overallScore:
    number;

    technicalScore:
    number;

    problemSolvingScore:
    number;

    communicationScore:
    number;

    feedback:
    string;

    interviewedAt:
    Date;

    status:
    MockInterviewStatus;

    createdAt:
    Date;
}