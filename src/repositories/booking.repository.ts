import type { Booking } from "../routes/bookings.js";

export type BookingInput = Omit<Booking, "id">;

export class BookingRepository {
  private readonly bookings: Booking[];

  constructor(initialBookings: Booking[] = []) {
    this.bookings = [...initialBookings];
  }

  findAll(): Booking[] {
    return [...this.bookings];
  }

  findById(id: string): Booking | undefined {
    return this.bookings.find((booking) => booking.id === id);
  }

  create(booking: BookingInput): Booking {
    const highestId = this.bookings.reduce((max, item) => {
      const numericId = Number(item.id);
      return Number.isFinite(numericId) ? Math.max(max, numericId) : max;
    }, 0);

    const newBooking: Booking = {
      id: String(highestId + 1),
      ...booking,
    };

    this.bookings.push(newBooking);

    return newBooking;
  }

  update(id: string, data: Partial<BookingInput>): Booking | undefined {
    const index = this.bookings.findIndex((booking) => booking.id === id);

    if (index === -1) {
      return undefined;
    }

    const currentBooking = this.bookings[index];

    if (!currentBooking) {
      return undefined;
    }

    const updatedBooking: Booking = {
      ...currentBooking,
      ...data,
      id,
    };

    this.bookings[index] = updatedBooking;

    return updatedBooking;
  }

  delete(id: string): Booking | undefined {
    const index = this.bookings.findIndex((booking) => booking.id === id);

    if (index === -1) {
      return undefined;
    }

    const [deletedBooking] = this.bookings.splice(index, 1);
    return deletedBooking;
  }
}
