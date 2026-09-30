import { BadRequestError } from "../errors/badRequestError.js";
import { NotFoundError } from "../errors/notFoundError.js";
import { BookingRepository, type BookingInput } from "../repositories/booking.repository.js";
import type { BookingWithId } from "../schemas/booking.schema.js";

const MAX_PAGE_SIZE = 50;

export class BookingService {
  constructor(
    private readonly bookingRepository: BookingRepository = new BookingRepository(),
  ) {}

  findAll(): BookingWithId[] {
    return this.bookingRepository.findAll();
  }

  findById(id: string): BookingWithId | undefined {
    return this.bookingRepository.findById(id);
  }

  create(booking: BookingInput): BookingWithId {
    if (booking.desk.length < 3) {
      throw new BadRequestError("Desk name must be at least 3 characters long");
    }

    return this.bookingRepository.create(booking);
  }

  update(id: string, data: Partial<BookingInput>): BookingWithId {
    if (data.desk !== undefined && data.desk.length < 3) {
      throw new BadRequestError("Desk name must be at least 3 characters long");
    }

    const booking = this.bookingRepository.update(id, data);

    if (!booking) {
      throw new NotFoundError("Booking not found");
    }

    return booking;
  }

  delete(id: string): BookingWithId {
    const booking = this.bookingRepository.delete(id);

    if (!booking) {
      throw new NotFoundError("Booking not found");
    }

    return booking;
  }

  getPaginatedShifts(page: number, limit: number): {
    data: BookingWithId[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  } {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(MAX_PAGE_SIZE, Math.max(1, limit));

    const total = this.bookingRepository.count();
    const totalPages = Math.max(1, Math.ceil(total / safeLimit));
    const skip = (safePage - 1) * safeLimit;
    const data = this.bookingRepository.findPaginated(skip, safeLimit);

    return {
      data,
      meta: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages,
      },
    };
  }
}
