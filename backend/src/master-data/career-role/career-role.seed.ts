import { HTTP_STATUS } from "../../core/constants/http-status.constants.js";
import { AppError } from "../../core/errors/app-error.js";
import { CareerDomainModel } from "../career-domain/career-domain.schema.js";
import {
    CareerRoleName,
    CareerRoleSlug,
} from "./career-role.enums.js";
import { CareerRoleModel } from "./career-role.schema.js";

export const CAREER_ROLE_SEED = [
    {
        name: CareerRoleName.NODE_JS_BACKEND_DEVELOPER,
        slug: CareerRoleSlug.NODE_JS_BACKEND_DEVELOPER,
        description:
            "Build APIs, services, and data-driven systems with Node.js.",

        /**
         * This will be replaced by the Backend
         * Domain ObjectId during the seed process.
         */
        domainSlug: "backend-development",
    },
    {
        name: CareerRoleName.REACT_FRONTEND_DEVELOPER,
        slug: CareerRoleSlug.REACT_FRONTEND_DEVELOPER,
        description:
            "Build accessible, responsive web experiences with React and TypeScript.",
        domainSlug: "frontend-development",
    },
    {
        name: CareerRoleName.DATA_ANALYST,
        slug: CareerRoleSlug.DATA_ANALYST,
        description:
            "Turn data into decisions using SQL, Python, statistics, and visualization.",
        domainSlug: "data-and-ai",
    },
    {
        name: CareerRoleName.UI_UX_DESIGNER,
        slug: CareerRoleSlug.UI_UX_DESIGNER,
        description:
            "Research user needs and design clear, usable digital products.",
        domainSlug: "design",
    },
    {
        name: CareerRoleName.DIGITAL_MARKETING_SPECIALIST,
        slug: CareerRoleSlug.DIGITAL_MARKETING_SPECIALIST,
        description:
            "Grow audiences and campaigns through content, search, social, and analytics.",
        domainSlug: "digital-marketing",
    },
];

export const seedCareerRoles = async (): Promise<void> => {
    console.log("Seeding Career Roles...");

    for (const role of CAREER_ROLE_SEED) {
        const domain = await CareerDomainModel.findOne({
            slug: role.domainSlug,
            isActive: true,
        });

        if (!domain) {
            throw new AppError(HTTP_STATUS.NOT_FOUND,
                `Career Domain with slug '${role.domainSlug}' not found.`
            );
        }

        const { domainSlug, ...roleData } = role;

        await CareerRoleModel.updateOne(
            {
                slug: role.slug,
            },
            {
                $set: {
                    ...roleData,
                    domainId: domain._id,
                },
            },
            {
                upsert: true,
            }
        );
    }

    console.log("✅ Career Roles seeded successfully.");
};