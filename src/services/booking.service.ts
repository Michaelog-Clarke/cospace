import { NotFoundError } from "../errors/notFoundError.js";
import {
  BookingRepository,
  type BookingInput,
  type BookingUpdateInput,
} from "../repositories/booking.repository.js";
import type { BookingWithId } from "../schemas/booking.schema.js";

const MAX_PAGE_SIZE = 50;

const isMissingRecordError = (error: unknown): boolean =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  error.code === "P2025";

export class BookingService {
  constructor(
    private readonly bookingRepository: BookingRepository = new BookingRepository(),
  ) {}

  findAll(): Promise<BookingWithId[]> {
    return this.bookingRepository.findAll();
  }

  findById(id: number): Promise<BookingWithId | null> {
    return this.bookingRepository.findById(id);
  }

  create(booking: BookingInput): Promise<BookingWithId> {
    return this.bookingRepository.create(booking);
  }

  async update(id: number, data: BookingUpdateInput): Promise<BookingWithId> {
    try {
      return await this.bookingRepository.update(id, data);
    } catch (error) {
      if (isMissingRecordError(error)) {
        throw new NotFoundError("Booking not found");
      }

      throw error;
    }
  }

  async delete(id: number): Promise<BookingWithId> {
    try {
      return await this.bookingRepository.delete(id);
    } catch (error) {
      if (isMissingRecordError(error)) {
        throw new NotFoundError("Booking not found");
      }

      throw error;
    }
  }

  async getPaginatedShifts(page: number, limit: number): Promise<{
    data: BookingWithId[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(MAX_PAGE_SIZE, Math.max(1, limit));
    const skip = (safePage - 1) * safeLimit;
    const [total, data] = await Promise.all([
      this.bookingRepository.count(),
      this.bookingRepository.findPaginated(skip, safeLimit),
    ]);

    return {
      data,
      meta: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.max(1, Math.ceil(total / safeLimit)),
      },
    };
  }
}
