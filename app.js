import express from "express"
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv"
dotenv.config()

import contactsRouter from "./routes/api/contactsRouter.js";
import authRouter from "./routes/api/authRouter.js";
import { sendEmail } from "./helpers/sendEmail.js";

const app = express();

app.use(morgan("short"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"))

app.use("/api/contacts", contactsRouter);
app.use("/api/auth", authRouter)

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

// sendEmail({
//   from: "mangenda@meta.ua",
//   to: "rrrgo3@gmail.com",
//   subject: "Test email for my app",
//   text: "Hello World",
//   html: "<p><strong>Test email</strong> Test my email from localhost:3000</p>"
// })

export default app
