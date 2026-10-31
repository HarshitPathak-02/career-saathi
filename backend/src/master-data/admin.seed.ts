import mongoose from "mongoose";
import { config } from "dotenv";
import { UserModel } from "../modules/users/user.model.js";
import { UserRole, AccountStatus } from "../modules/users/user.enums.js";
import { hashPassword } from "../shared/utils/bcrypt.util.js";

config({ path: "C:/careersaathi/backend/.env" });

export const seedAdminUser = async () => {
  const email = "pathak.admin@careersaathi.com";
  const rawPassword = "pathakhiadminhai";
  const fullName = "Harshit Pathak (Admin)";

  const hashedPassword = await hashPassword(rawPassword);

  const existing = await UserModel.findOne({ email });
  if (existing) {
    existing.fullName = fullName;
    existing.password = hashedPassword;
    existing.role = UserRole.ADMIN;
    existing.accountStatus = AccountStatus.ACTIVE;
    existing.emailVerified = true;
    await existing.save();
    console.log(`Admin user '${email}' updated successfully with ADMIN role.`);
  } else {
    await UserModel.create({
      fullName,
      email,
      password: hashedPassword,
      role: UserRole.ADMIN,
      accountStatus: AccountStatus.ACTIVE,
      emailVerified: true,
    });
    console.log(`Admin user '${email}' created successfully with ADMIN role.`);
  }
};

const run = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not set in environment.");
    }
    await mongoose.connect(uri);
    console.log("Connected to MongoDB for admin seeding...");
    await seedAdminUser();
    await mongoose.disconnect();
    console.log("Admin seed completed successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Admin seed failed:", err);
    process.exit(1);
  }
};

run();
