import express, { type Express, type Request, type Response } from "express";

const app: Express = express();

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    status: "active",
    message: "CoSpace API is running",
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;