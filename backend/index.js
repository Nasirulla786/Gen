import express from "express"
import dotenv from "dotenv"
import ConnectDb from "./config/db.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();

app.use(express.json())
app.use(cookieParser())


app.use("/api/auth" , authRouter);





app.listen(3000,()=>{
    ConnectDb();
    console.log("running");
})
