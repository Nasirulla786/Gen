import express from "express"
import isAuth from "../middleware/isAuth.js";
import { getAllReport, getReport, interviewDetails } from "../controllers/interview.controller.js";
import upload from "../middleware/multer.js";
const interviewRouter = express.Router();

interviewRouter.post("/", isAuth , upload.single("resume") ,interviewDetails)
interviewRouter.get("/report/:id" , isAuth , getReport)
interviewRouter.get("/all-reports" , isAuth , getAllReport)



export default interviewRouter;
