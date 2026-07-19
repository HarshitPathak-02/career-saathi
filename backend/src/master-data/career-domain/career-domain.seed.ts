import {
  CareerDomainName,
  CareerDomainSlug,
} from "./career-domain.enums.js";
import { CareerDomainModel } from "./career-domain.schema.js";

export const CAREER_DOMAIN_SEED = [
  {
    name: CareerDomainName.BACKEND,
    slug: CareerDomainSlug.BACKEND,
    description: "Backend Development Career Path",
  },
];

export const seedCareerDomains = async () => {
    console.log("Seeding Career Domains...");

    for (const domain of CAREER_DOMAIN_SEED) {
        await CareerDomainModel.updateOne(
            { slug: domain.slug },
            { $set: domain },
            { upsert: true }
        );
    }

    console.log("Career Domains seeded successfully.");
};