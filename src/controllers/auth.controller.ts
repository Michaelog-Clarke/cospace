import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { BadRequestError } from "../errors/badRequestError.js";
import { ConflictError } from "../errors/conflictError.js";
import { UnauthorizedError } from "../errors/unauthorizedError.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import {
  type CreateUserInput,
  UserRepository,
} from "../repositories/user.repository.js";
import { comparePassword, generateToken, hashPassword } from "../utils/auth.js";

const registerSchema = z.object({
  first_name: z.string().trim().min(1),
  last_name: z.string().trim().min(1),
  email: z.string().trim().email().transform((email) => email.toLowerCase()),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().trim().email().transform((email) => email.toLowerCase()),
  password: z.string().min(1),
});

const parseBody = <T>(schema: z.ZodType<T>, body: unknown): T => {
  const result = schema.safeParse(body);
  if (!result.success) {
    throw new BadRequestError(
      "Validation failed",
      result.error.issues.map((issue) => ({
        path: issue.path.length > 0 ? issue.path.join(".") : "body",
        message: issue.message,
      })),
    );
  }

  return result.data;
};

const isUniqueConstraintError = (error: unknown): boolean =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  error.code === "P2002";

export class AuthController {
  constructor(
    private readonly userRepository: UserRepository = new UserRepository(),
  ) {}

  register = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const input = parseBody(registerSchema, req.body);
      const emailExists = await this.userRepository.emailExists(input.email);

      if (emailExists) {
        throw new ConflictError("An account with this email already exists");
      }

      const userInput: CreateUserInput = {
        ...input,
        password: await hashPassword(input.password),
      };
      const user = await this.userRepository.create(userInput);

      res.status(HTTP_STATUS.CREATED).json({ user });
    } catch (error) {
      next(
        isUniqueConstraintError(error)
          ? new ConflictError("An account with this email already exists")
          : error,
      );
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const input = parseBody(loginSchema, req.body);
      const user = await this.userRepository.findCredentialsByEmail(input.email);

      if (!user || !(await comparePassword(input.password, user.password))) {
        throw new UnauthorizedError("Invalid email or password");
      }

      const token = generateToken({ id: user.id, email: user.email });
      res.status(HTTP_STATUS.OK).json({ token });
    } catch (error) {
      next(error);
    }
  };
}
