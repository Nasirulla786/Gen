import { PDFParse } from "pdf-parse";
import generateInterviewReport from "../services/ai.service.js";
import InterviewReport from "../model/interview.model.js";

export const interviewDetails = async(req , res)=>{
    try {
        const {selfDescription , jobDescription} = req.body;;
        const resumeContent =  PDFParse(req.file.buffer)

        const report = await generateInterviewReport({
            resume:resumeContent,
            selfDescription,
            jobDescription
        })


        const interReport = await InterviewReport.create({
            user:req.userId,
            resume:resumeContent,
            selfDescription,
            jobDescription,
            ...report
        })

        res.status(201).json({message:"Interview report create successfully"})

    } catch (error) {
        console.log(error);

        res.status(500).json({message:"internal server error"})

    }

}
