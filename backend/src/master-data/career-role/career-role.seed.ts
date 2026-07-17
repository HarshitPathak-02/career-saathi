import {
  CareerRoleName,
  CareerRoleSlug,
} from "./career-role.enums.js";

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