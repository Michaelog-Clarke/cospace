# TypeScript Notes

## Booking interface and mock data

We defined a TypeScript `Booking` interface with the following fields:

- `id: number`
- `desk: string`
- `floor: number`
- `date: string`
- `active: boolean`

We also created an in-memory array of three mock bookings to use as initial data.

```ts
export interface Booking {
  id: number;
  desk: string;
  floor: number;
  date: string;
  active: boolean;
}

export const bookings: Booking[] = [
  { id: 1, desk: "A1", floor: 1, date: "2026-09-22", active: true },
  { id: 2, desk: "B4", floor: 2, date: "2026-09-23", active: false },
  { id: 3, desk: "C7", floor: 3, date: "2026-09-24", active: true },
];
```

## Express routes for bookings

We added the following routes:

### `GET /bookings`
Returns the full bookings array.

```ts
app.get("/bookings", (req: Request, res: Response) => {
  res.status(200).json(bookings);
});
```

### `GET /bookings/:id`
Extracts a route parameter using `req.params.id`, finds the matching booking, and returns 404 if it doesn't exist.

```ts
app.get("/bookings/:id", (req: Request, res: Response) => {
  const bookingId = Number(req.params.id);
  const booking = bookings.find((item) => item.id === bookingId);

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  return res.status(200).json(booking);
});
```

### `POST /bookings`
Reads the JSON request body using `req.body`, validates required fields, creates a new `Booking`, and adds it to the array.

```ts
app.use(express.json());

app.post("/bookings", (req: Request, res: Response) => {
  const payload = req.body as Partial<Booking>;
  const { desk, floor, date, active } = payload;

  if (!desk || typeof floor !== "number" || !date || typeof active !== "boolean") {
    return res.status(400).json({ message: "Invalid booking payload" });
  }

  const newBooking: Booking = {
    id: bookings.length ? Math.max(...bookings.map((item) => item.id)) + 1 : 1,
    desk,
    floor,
    date,
    active,
  };

  bookings.push(newBooking);

  return res.status(201).json(newBooking);
});
```

## Update and delete routes

We also added the following routes for updating and deleting bookings by ID:

### `PUT /bookings/:id`
Replaces the entire booking object for the matching ID.

```ts
app.put("/bookings/:id", (req: Request, res: Response) => {
  const bookingId = Number(req.params.id);
  const index = bookings.findIndex((item) => item.id === bookingId);

  if (index === -1) {
    return res.status(404).json({ message: "Booking not found" });
  }

  const payload = req.body as Partial<Booking>;
  const { desk, floor, date, active } = payload;

  if (!desk || typeof floor !== "number" || !date || typeof active !== "boolean") {
    return res.status(400).json({ message: "Invalid booking payload" });
  }

  const updatedBooking: Booking = {
    id: bookingId,
    desk,
    floor,
    date,
    active,
  };

  bookings[index] = updatedBooking;

  return res.status(200).json(updatedBooking);
});
```

### `PATCH /bookings/:id`
Updates only the `active` property while leaving the rest of the booking unchanged.

```ts
app.patch("/bookings/:id", (req: Request, res: Response) => {
  const bookingId = Number(req.params.id);
  const index = bookings.findIndex((item) => item.id === bookingId);

  if (index === -1) {
    return res.status(404).json({ message: "Booking not found" });
  }

  const { active } = req.body as Partial<Booking>;

  if (typeof active !== "boolean") {
    return res.status(400).json({ message: "Active status must be a boolean" });
  }

  bookings[index].active = active;

  return res.status(200).json(bookings[index]);
});
```

### `DELETE /bookings/:id`
Removes the booking with the matching ID from the array.

```ts
app.delete("/bookings/:id", (req: Request, res: Response) => {
  const bookingId = Number(req.params.id);
  const index = bookings.findIndex((item) => item.id === bookingId);

  if (index === -1) {
    return res.status(404).json({ message: "Booking not found" });
  }

  const [deletedBooking] = bookings.splice(index, 1);

  if (!deletedBooking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  return res.status(200).json({
    message: "Booking deleted",
    deletedBooking,
  });
});
```

## Key concepts covered

- Defining interfaces in TypeScript
- Creating typed arrays of objects
- Using Express JSON parsing with `express.json()`
- Reading route params with `req.params`
- Reading request payloads with `req.body`
- Replacing, updating, and deleting data in an in-memory array
- Validating request data before saving
- Returning JSON responses with status codes

## Validation

The TypeScript project was checked with:

```bash
npx tsc --noEmit -p tsconfig.json
```

This passed successfully.
