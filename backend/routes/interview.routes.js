import express from "express"
import isAuth from "../middleware/isAuth.js";
import { interviewDetails } from "../controllers/interview.controller.js";
import upload from "../middleware/multer.js";
const interviewRouter = express.Router();

interviewRouter.post("/", isAuth , upload.single("resume") ,interviewDetails)



export default interviewRouter;
