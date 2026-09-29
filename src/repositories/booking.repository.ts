import type { Booking, BookingWithId } from "../schemas/booking.schema.js";

export type BookingInput = Booking;

export class BookingRepository {
  private readonly bookings: BookingWithId[];

  constructor(initialBookings: BookingWithId[] = []) {
    this.bookings = [...initialBookings];
  }

  findAll(): BookingWithId[] {
    return [...this.bookings];
  }

  findPaginated(skip: number, limit: number): BookingWithId[] {
    const safeSkip = Math.max(0, skip);
    const safeLimit = Math.max(0, limit);


    return this.bookings.slice(safeSkip, safeSkip + safeLimit);
  }

  count(): number {
    return this.bookings.length;
  }

  findById(id: string): BookingWithId | undefined {
    return this.bookings.find((booking) => booking.id === id);
  }

  create(booking: BookingInput): BookingWithId {
    const highestId = this.bookings.reduce((max, item) => {
      const numericId = Number(item.id);
      return Number.isFinite(numericId) ? Math.max(max, numericId) : max;
    }, 0);

    const newBooking: BookingWithId = {
      id: String(highestId + 1),
      ...booking,
    };

    this.bookings.push(newBooking);

    return newBooking;
  }

  update(id: string, data: Partial<BookingInput>): BookingWithId | undefined {
    const index = this.bookings.findIndex((booking) => booking.id === id);

    if (index === -1) {
      return undefined;
    }

    const currentBooking = this.bookings[index];

    if (!currentBooking) {
      return undefined;
    }

    const updatedBooking: BookingWithId = {
      ...currentBooking,
      ...data,
      id,
    };

    this.bookings[index] = updatedBooking;

    return updatedBooking;
  }

  delete(id: string): BookingWithId | undefined {
    const index = this.bookings.findIndex((booking) => booking.id === id);

    if (index === -1) {
      return undefined;
    }

    const [deletedBooking] = this.bookings.splice(index, 1);
    return deletedBooking;
  }
}
