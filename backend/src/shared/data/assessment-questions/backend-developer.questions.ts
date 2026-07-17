import {
    CareerRoleCode,
} from '../../../modules/career-role/career-role.enums.js';

import {
    QuestionDifficulty,
    QuestionType,
} from '../../../modules/assessment-question/assessment-question.enums.js';

import {
    CreateAssessmentQuestionData,
} from '../../../modules/assessment-question/assessment-question.types.js';

export const backendDeveloperQuestions:
    CreateAssessmentQuestionData[] = [

        // =====================================================
        // JAVASCRIPT VARIABLES & DECLARATIONS (TASK TESTING)
        // =====================================================

        {
            careerRoleCode: CareerRoleCode.BACKEND_DEVELOPER,
            skillCode: "JAVASCRIPT",
            topicCodes: [
                "JS_VARIABLES",
                "JS_DECLARATIONS",
            ],
            difficulty: QuestionDifficulty.EASY,
            type: QuestionType.MCQ,
            question: "Which keyword declares a constant in JavaScript?",
            options: [
                "var",
                "let",
                "const",
                "static",
            ],
            correctAnswer: "const",
            explanation: "const declares a block-scoped variable that cannot be reassigned.",
            isActive: true,
        },

        {
            careerRoleCode: CareerRoleCode.BACKEND_DEVELOPER,
            skillCode: "JAVASCRIPT",
            topicCodes: [
                "JS_VARIABLES",
                "JS_DECLARATIONS",
            ],
            difficulty: QuestionDifficulty.EASY,
            type: QuestionType.MCQ,
            question: "Which keyword is block scoped and allows reassignment?",
            options: [
                "var",
                "const",
                "let",
                "define",
            ],
            correctAnswer: "let",
            explanation: "let creates a block-scoped variable that can be reassigned.",
            isActive: true,
        },

        {
            careerRoleCode: CareerRoleCode.BACKEND_DEVELOPER,
            skillCode: "JAVASCRIPT",
            topicCodes: [
                "JS_VARIABLES",
                "JS_DECLARATIONS",
            ],
            difficulty: QuestionDifficulty.MEDIUM,
            type: QuestionType.MCQ,
            question: "What is the output?\n\nlet x = 5;\nx = 8;\nconsole.log(x);",
            options: [
                "5",
                "8",
                "undefined",
                "Error",
            ],
            correctAnswer: "8",
            explanation: "Variables declared with let can be reassigned.",
            isActive: true,
        },

        {
            careerRoleCode: CareerRoleCode.BACKEND_DEVELOPER,
            skillCode: "JAVASCRIPT",
            topicCodes: [
                "JS_VARIABLES",
                "JS_DECLARATIONS",
            ],
            difficulty: QuestionDifficulty.MEDIUM,
            type: QuestionType.TRUE_FALSE,
            question: "Variables declared with var are function scoped.",
            options: [
                "True",
                "False",
            ],
            correctAnswer: "True",
            explanation: "var is function scoped whereas let and const are block scoped.",
            isActive: true,
        },

        {
            careerRoleCode: CareerRoleCode.BACKEND_DEVELOPER,
            skillCode: "JAVASCRIPT",
            topicCodes: [
                "JS_VARIABLES",
                "JS_DECLARATIONS",
            ],
            difficulty: QuestionDifficulty.HARD,
            type: QuestionType.MCQ,
            question: "Which statement about const is correct?",
            options: [
                "The variable cannot be accessed.",
                "The referenced object cannot be modified.",
                "The variable binding cannot be reassigned.",
                "const variables are globally scoped.",
            ],
            correctAnswer: "The variable binding cannot be reassigned.",
            explanation: "const prevents reassignment of the variable binding but does not make referenced objects immutable.",
            isActive: true,
        },

        // =====================================================
        // NODE JS
        // =====================================================

        {
            careerRoleCode:
                CareerRoleCode.BACKEND_DEVELOPER,

            skillCode:
                'NODE_JS',

            topicCodes: [
                'NODE_RUNTIME',
                'NODE_V8',
            ],

            difficulty:
                QuestionDifficulty.EASY,

            type:
                QuestionType.MCQ,

            question:
                'Node.js is built on which JavaScript engine?',

            options: [
                'SpiderMonkey',
                'JavaScriptCore',
                'V8',
                'Chakra',
            ],

            correctAnswer:
                'V8',

            explanation:
                'Node.js uses the Google V8 JavaScript engine.',

            isActive:
                true,
        },

        {
            careerRoleCode:
                CareerRoleCode.BACKEND_DEVELOPER,

            skillCode:
                'NODE_JS',

            topicCodes: [
                'NODE_HTTP',
                'NODE_CORE_MODULES',
            ],

            difficulty:
                QuestionDifficulty.MEDIUM,

            type:
                QuestionType.MCQ,

            question:
                'Which built-in Node.js module is used to create an HTTP server?',

            options: [
                'http',
                'server',
                'network',
                'request',
            ],

            correctAnswer:
                'http',

            explanation:
                'The built-in http module can create HTTP servers.',

            isActive:
                true,
        },

        // =====================================================
        // EXPRESS
        // =====================================================

        {
            careerRoleCode:
                CareerRoleCode.BACKEND_DEVELOPER,

            skillCode:
                'EXPRESS',

            topicCodes: [
                'EXPRESS_APPLICATION',
                'EXPRESS_SETUP',
            ],

            difficulty:
                QuestionDifficulty.EASY,

            type:
                QuestionType.MCQ,

            question:
                'Which method is commonly used to create an Express application?',

            options: [
                'express()',
                'express.create()',
                'createExpress()',
                'app()',
            ],

            correctAnswer:
                'express()',

            explanation:
                'Calling express() creates an Express application instance.',

            isActive:
                true,
        },

        {
            careerRoleCode:
                CareerRoleCode.BACKEND_DEVELOPER,

            skillCode:
                'EXPRESS',

            topicCodes: [
                'EXPRESS_MIDDLEWARE',
            ],

            difficulty:
                QuestionDifficulty.MEDIUM,

            type:
                QuestionType.MCQ,

            question:
                'Which Express method is used to register middleware?',

            options: [
                'app.use()',
                'app.middleware()',
                'app.register()',
                'app.attach()',
            ],

            correctAnswer:
                'app.use()',

            explanation:
                'app.use() is used to mount middleware in an Express application.',

            isActive:
                true,
        },

        // =====================================================
        // MONGODB
        // =====================================================

        {
            careerRoleCode:
                CareerRoleCode.BACKEND_DEVELOPER,

            skillCode:
                'MONGODB',

            topicCodes: [
                'MONGODB_DOCUMENTS',
                'MONGODB_DATA_MODEL',
            ],

            difficulty:
                QuestionDifficulty.EASY,

            type:
                QuestionType.MCQ,

            question:
                'MongoDB stores data primarily in which structure?',

            options: [
                'Rows',
                'Documents',
                'Tables',
                'Graphs',
            ],

            correctAnswer:
                'Documents',

            explanation:
                'MongoDB stores records as BSON documents.',

            isActive:
                true,
        },

        {
            careerRoleCode:
                CareerRoleCode.BACKEND_DEVELOPER,

            skillCode:
                'MONGODB',

            topicCodes: [
                'MONGODB_QUERY_OPERATORS',
                'MONGODB_COMPARISON_OPERATORS',
            ],

            difficulty:
                QuestionDifficulty.MEDIUM,

            type:
                QuestionType.MCQ,

            question:
                'Which MongoDB operator is used to match values greater than a specified value?',

            options: [
                '$gt',
                '$lt',
                '$eq',
                '$in',
            ],

            correctAnswer:
                '$gt',

            explanation:
                '$gt matches values greater than the specified value.',

            isActive:
                true,
        },

        // =====================================================
        // REST API
        // =====================================================

        {
            careerRoleCode:
                CareerRoleCode.BACKEND_DEVELOPER,

            skillCode:
                'REST_API',

            topicCodes: [
                'HTTP_METHODS',
                'REST_RESOURCE_OPERATIONS',
            ],

            difficulty:
                QuestionDifficulty.EASY,

            type:
                QuestionType.MCQ,

            question:
                'Which HTTP method is commonly used to retrieve a resource?',

            options: [
                'POST',
                'GET',
                'PATCH',
                'DELETE',
            ],

            correctAnswer:
                'GET',

            explanation:
                'GET is used to retrieve a resource from a server.',

            isActive:
                true,
        },

        {
            careerRoleCode:
                CareerRoleCode.BACKEND_DEVELOPER,

            skillCode:
                'REST_API',

            topicCodes: [
                'HTTP_STATUS_CODES',
                'REST_RESPONSE_CODES',
            ],

            difficulty:
                QuestionDifficulty.MEDIUM,

            type:
                QuestionType.MCQ,

            question:
                'Which HTTP status code represents a successfully created resource?',

            options: [
                '200',
                '201',
                '204',
                '400',
            ],

            correctAnswer:
                '201',

            explanation:
                'HTTP 201 Created indicates that a resource was successfully created.',

            isActive:
                true,
        },

        // =====================================================
        // AUTHENTICATION
        // =====================================================

        {
            careerRoleCode:
                CareerRoleCode.BACKEND_DEVELOPER,

            skillCode:
                'AUTHENTICATION',

            topicCodes: [
                'AUTH_IDENTITY',
                'AUTH_BASICS',
            ],

            difficulty:
                QuestionDifficulty.EASY,

            type:
                QuestionType.MCQ,

            question:
                'What is the primary purpose of authentication?',

            options: [
                'Verify user identity',
                'Assign permissions',
                'Encrypt database records',
                'Validate API routes',
            ],

            correctAnswer:
                'Verify user identity',

            explanation:
                'Authentication verifies the identity of a user.',

            isActive:
                true,
        },

        {
            careerRoleCode:
                CareerRoleCode.BACKEND_DEVELOPER,

            skillCode:
                'AUTHENTICATION',

            topicCodes: [
                'JWT_STRUCTURE',
                'JWT_CLAIMS',
            ],

            difficulty:
                QuestionDifficulty.MEDIUM,

            type:
                QuestionType.MCQ,

            question:
                'Which part of a JWT contains claims about the user or token?',

            options: [
                'Header',
                'Payload',
                'Signature',
                'Secret',
            ],

            correctAnswer:
                'Payload',

            explanation:
                'The JWT payload contains claims associated with the token.',

            isActive:
                true,
        },
    ];