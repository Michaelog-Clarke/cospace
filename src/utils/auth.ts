import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt, { type JwtPayload } from "jsonwebtoken";

dotenv.config();

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return secret;
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(user: Record<string, unknown>): string {
  return jwt.sign(user, getJwtSecret(), { expiresIn: "1d" });
}

export function verifyToken(token: string): string | JwtPayload {
  return jwt.verify(token, getJwtSecret());
}
