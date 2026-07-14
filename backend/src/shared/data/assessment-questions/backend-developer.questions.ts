// import { CareerRoleCode } from '../../../modules/career-role/career-role.enums.js';

// import {
//     QuestionDifficulty,
//     QuestionType,
// } from '../../../modules/assessment-question/assessment-question.enums.js';

// export const backendDeveloperQuestions = [

//     {
//         careerRoleCode:
//             CareerRoleCode.BACKEND_DEVELOPER,

//         skillCode: 'javascript',

//         difficulty:
//             QuestionDifficulty.EASY,

//         type:
//             QuestionType.MCQ,

//         question:
//             'Which keyword is used to declare a constant in JavaScript?',

//         options: [
//             'let',
//             'var',
//             'const',
//             'static',
//         ],

//         correctAnswer:
//             'const',

//         explanation:
//             'const declares a block-scoped constant.',

//         isActive: true,
//     },

//     {
//         careerRoleCode:
//             CareerRoleCode.BACKEND_DEVELOPER,

//         skillCode: 'javascript',

//         difficulty:
//             QuestionDifficulty.EASY,

//         type:
//             QuestionType.TRUE_FALSE,

//         question:
//             'JavaScript is single-threaded.',

//         options: [
//             'True',
//             'False',
//         ],

//         correctAnswer:
//             'True',

//         explanation:
//             'JavaScript executes on a single thread.',

//         isActive: true,
//     },
// ];

import { CareerRoleCode } from '../../../modules/career-role/career-role.enums.js';
import {
    QuestionDifficulty,
    QuestionType,
} from '../../../modules/assessment-question/assessment-question.enums.js';

export const nodeJsQuestions = [

    {
        careerRoleCode: CareerRoleCode.BACKEND_DEVELOPER,
        skillCode: 'NODE_JS',
        difficulty: QuestionDifficulty.EASY,
        type: QuestionType.MCQ,
        question: 'Node.js is built on which JavaScript engine?',
        options: ['SpiderMonkey', 'JavaScriptCore', 'V8', 'Chakra'],
        correctAnswer: 'V8',
        explanation: 'Node.js uses the Google V8 JavaScript engine.',
        isActive: true,
    },

    {
        careerRoleCode: CareerRoleCode.BACKEND_DEVELOPER,
        skillCode: 'NODE_JS',
        difficulty: QuestionDifficulty.EASY,
        type: QuestionType.MCQ,
        question: 'Which object is used to export functionality from a Node.js module?',
        options: ['exports', 'module.exports', 'Both', 'require'],
        correctAnswer: 'Both',
        explanation: 'Both exports and module.exports can export functionality.',
        isActive: true,
    },

    {
        careerRoleCode: CareerRoleCode.BACKEND_DEVELOPER,
        skillCode: 'NODE_JS',
        difficulty: QuestionDifficulty.EASY,
        type: QuestionType.MCQ,
        question: 'Which keyword imports another module in CommonJS?',
        options: ['import', 'include', 'require', 'use'],
        correctAnswer: 'require',
        explanation: 'CommonJS uses require() to import modules.',
        isActive: true,
    },

    {
        careerRoleCode: CareerRoleCode.BACKEND_DEVELOPER,
        skillCode: 'NODE_JS',
        difficulty: QuestionDifficulty.MEDIUM,
        type: QuestionType.MCQ,
        question: 'Which module is used to create an HTTP server?',
        options: ['http', 'https', 'server', 'net'],
        correctAnswer: 'http',
        explanation: 'The built-in http module creates HTTP servers.',
        isActive: true,
    },

    {
        careerRoleCode: CareerRoleCode.BACKEND_DEVELOPER,
        skillCode: 'NODE_JS',
        difficulty: QuestionDifficulty.MEDIUM,
        type: QuestionType.MCQ,
        question: 'Which method starts an HTTP server?',
        options: ['run()', 'listen()', 'start()', 'open()'],
        correctAnswer: 'listen()',
        explanation: 'server.listen() starts accepting requests.',
        isActive: true,
    },

    {
        careerRoleCode: CareerRoleCode.BACKEND_DEVELOPER,
        skillCode: 'NODE_JS',
        difficulty: QuestionDifficulty.MEDIUM,
        type: QuestionType.MCQ,
        question: 'Which module is used for file system operations?',
        options: ['path', 'os', 'fs', 'stream'],
        correctAnswer: 'fs',
        explanation: 'The fs module handles file operations.',
        isActive: true,
    },

    {
        careerRoleCode: CareerRoleCode.BACKEND_DEVELOPER,
        skillCode: 'NODE_JS',
        difficulty: QuestionDifficulty.MEDIUM,
        type: QuestionType.MCQ,
        question: 'Node.js follows which programming model?',
        options: [
            'Blocking',
            'Event-driven',
            'Thread-per-request',
            'Synchronous only'
        ],
        correctAnswer: 'Event-driven',
        explanation: 'Node.js is event-driven and non-blocking.',
        isActive: true,
    },

    {
        careerRoleCode: CareerRoleCode.BACKEND_DEVELOPER,
        skillCode: 'NODE_JS',
        difficulty: QuestionDifficulty.HARD,
        type: QuestionType.MCQ,
        question: 'Which object represents the current executing module?',
        options: ['exports', 'module', 'process', 'global'],
        correctAnswer: 'module',
        explanation: 'module contains metadata about the current module.',
        isActive: true,
    },

    {
        careerRoleCode: CareerRoleCode.BACKEND_DEVELOPER,
        skillCode: 'NODE_JS',
        difficulty: QuestionDifficulty.HARD,
        type: QuestionType.MCQ,
        question: 'Which global object provides environment variables?',
        options: ['global.env', 'process.env', 'env', 'system.env'],
        correctAnswer: 'process.env',
        explanation: 'Environment variables are available through process.env.',
        isActive: true,
    },

    {
        careerRoleCode: CareerRoleCode.BACKEND_DEVELOPER,
        skillCode: 'NODE_JS',
        difficulty: QuestionDifficulty.HARD,
        type: QuestionType.MCQ,
        question: 'Which Node.js module is used to work with file paths?',
        options: ['fs', 'os', 'path', 'url'],
        correctAnswer: 'path',
        explanation: 'The path module provides utilities for working with file paths.',
        isActive: true,
    }

];