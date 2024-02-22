import express from "express"
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv"
dotenv.config()

import contactsRouter from "./routes/api/contactsRouter.js";
import authRouter from "./routes/api/authRouter.js";

const app = express();

app.use(morgan("short"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);
app.use("/api/auth", authRouter)

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

export default app
