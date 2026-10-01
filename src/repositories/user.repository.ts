import type { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../utils/db.js";

const publicUserSelect = {
  id: true,
  first_name: true,
  last_name: true,
  email: true,
  team_id: true,
} satisfies Prisma.UserSelect;

const userCredentialsSelect = {
  ...publicUserSelect,
  password: true,
} satisfies Prisma.UserSelect;

export type PublicUser = Prisma.UserGetPayload<{
  select: typeof publicUserSelect;
}>;
export type UserCredentials = Prisma.UserGetPayload<{
  select: typeof userCredentialsSelect;
}>;
export type CreateUserInput = Pick<
  Prisma.UserUncheckedCreateInput,
  "first_name" | "last_name" | "email" | "password"
>;

export class UserRepository {
  async emailExists(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    return user !== null;
  }

  findCredentialsByEmail(email: string): Promise<UserCredentials | null> {
    return prisma.user.findUnique({
      where: { email },
      select: userCredentialsSelect,
    });
  }

  create(data: CreateUserInput): Promise<PublicUser> {
    return prisma.user.create({
      data,
      select: publicUserSelect,
    });
  }
}
