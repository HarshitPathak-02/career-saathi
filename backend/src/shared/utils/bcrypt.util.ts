import bcrypt from 'bcrypt';
import { securityConfig } from '../../config/security.js';

export const hashPassword = async (
  password: string
): Promise<string> => {
  return bcrypt.hash(
    password,
    securityConfig.bcryptSaltRounds
  );
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};