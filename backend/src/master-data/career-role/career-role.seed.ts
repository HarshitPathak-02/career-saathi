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
      "Node.js Backend Developer Career Path",

    /**
     * This will be replaced by the Backend
     * Domain ObjectId during the seed process.
     */
    domainSlug: "backend-development",
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
            throw new Error(
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