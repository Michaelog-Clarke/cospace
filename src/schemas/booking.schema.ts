import { z } from "zod";

import type { Booking as PrismaBooking } from "../generated/prisma/client.js";

const bookingDateSchema = z
  .string()
  .refine((value) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return false;
    }

    const parsed = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
  }, "Booking date must be a valid ISO date string")
  .transform((value) => new Date(`${value}T00:00:00.000Z`));

export const createBookingSchema = z.object({
  user_id: z.number().int().positive(),
  desk_id: z.number().int().positive(),
  booking_date: bookingDateSchema,
  active: z.boolean().optional().default(true),
});

export const updateBookingSchema = createBookingSchema.partial();

export type Booking = z.infer<typeof createBookingSchema>;
export type BookingWithId = PrismaBooking;
export type CreateBookingInput = Booking;
