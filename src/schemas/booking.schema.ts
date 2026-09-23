import { z } from "zod";

export const createBookingSchema = z.object({
  desk: z
    .string()
    .trim()
    .min(3, "Desk must be at least 3 characters long")
    .max(100, "Desk must be at most 100 characters long"),
  floor: z
    .string()
    .trim()
    .min(5, "Floor must be at least 5 characters long")
    .max(200, "Floor must be at most 200 characters long"),
  date: z.string().refine((value) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return false;
    }

    const parsed = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
  }, "Date must be a valid ISO date string"),
  active: z.boolean().optional().default(true),
});

export type Booking = z.infer<typeof createBookingSchema>;
export type BookingWithId = Booking & { id: string };
export type CreateBookingInput = Booking;
