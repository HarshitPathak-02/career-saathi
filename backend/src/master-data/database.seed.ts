import mongoose from "mongoose";
import { config } from "dotenv";

import { seedCareerDomains } from "./career-domain/career-domain.seed.js";
import { seedCareerRoles } from "./career-role/career-role.seed.js";
import { seedCareerRoleSkills } from "./career-role-skill/career-role-skill.seed.js";
import { seedSkillCatalog } from "./skill-catalog/skill-catalog.seed.js";

config();

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);

        console.log("Database connected.");

        // await seedCareerDomains();
        // await seedCareerRoles();
        // await seedCareerRoleSkills();
        await seedSkillCatalog();
        console.log("Database seeded successfully.");

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedDatabase();