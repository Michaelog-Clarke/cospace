import express, { type Express, type Request, type Response } from "express";

import { HTTP_STATUS } from "./constants/httpStatus.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { loggerMiddleware } from "./middleware/logger.js";
import bookingRouter from "./routes/booking.routes.js";

const app: Express = express();

app.use(express.json());
app.use(loggerMiddleware);

app.get("/", (req: Request, res: Response) => {
  res.status(HTTP_STATUS.OK).json({
    status: "active",
    message: "CoSpace API is running",
  });
});

app.use("/bookings", bookingRouter);
app.get("/boom-unexpected", () => {
  throw new Error("database connection failed");
});

app.use(errorHandler);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}/`);
});

export default app;