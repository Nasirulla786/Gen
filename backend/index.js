import express from "express";
import dotenv from "dotenv";
import ConnectDb from "./config/db.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import interviewRouter from "./routes/interview.routes.js";




dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://gen-1-u23e.onrender.com",
    credentials: true,
  }),
);

app.use("/api/auth", authRouter);
app.use("/api/interview" , interviewRouter)

app.listen(3000, () => {
  ConnectDb();

  console.log("running");
});
