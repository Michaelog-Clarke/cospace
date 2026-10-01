import type { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../utils/db.js";

import type { BookingWithId } from "../schemas/booking.schema.js";

export type BookingInput = Omit<Prisma.BookingUncheckedCreateInput, "id">;
export type BookingUpdateInput = Prisma.BookingUncheckedUpdateInput;

export class BookingRepository {
  findAll(): Promise<BookingWithId[]> {
    return prisma.booking.findMany({ orderBy: { id: "asc" } });
  }

  findPaginated(skip: number, limit: number): Promise<BookingWithId[]> {
    return prisma.booking.findMany({
      skip: Math.max(0, skip),
      take: Math.max(0, limit),
      orderBy: { id: "asc" },
    });
  }

  count(): Promise<number> {
    return prisma.booking.count();
  }

  findById(id: number): Promise<BookingWithId | null> {
    return prisma.booking.findUnique({ where: { id } });
  }

  create(data: BookingInput): Promise<BookingWithId> {
    return prisma.booking.create({ data });
  }

  update(id: number, data: BookingUpdateInput): Promise<BookingWithId> {
    return prisma.booking.update({ where: { id }, data });
  }

  delete(id: number): Promise<BookingWithId> {
    return prisma.booking.delete({ where: { id } });
  }
}
