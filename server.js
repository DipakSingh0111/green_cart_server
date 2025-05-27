import express from "express";
import dotenv from "dotenv";
import { connectDatabase } from "./config/database.js";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

// dotenv config
dotenv.config();

const app = express();

// Allow multiple origins
const allowedOrigins = ["http://localhost:5173"];

// middlewares configration
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// database
connectDatabase();

// routes

app.get("/", (req, res) => {
  res.send("This is My First Backend App");
  console.log("This is a node app...");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is Running on PORT ${PORT}`);
});
