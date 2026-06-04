import { PDFParse } from "pdf-parse";
import generateInterviewReport from "../services/ai.service.js";
import InterviewReport from "../model/interview.model.js";

export const interviewDetails = async (req, res) => {
  try {
    const { selfDescription, jobDescription } = req.body;

    const parser = new PDFParse({
      data: Uint8Array.from(req.file.buffer),
    });

    const pdfData = await parser.getText();

    const resumeContent = pdfData.text;

    const report = await generateInterviewReport({
      resume: resumeContent,
      selfDescription,
      jobDescription,
    });

    // console.log(JSON.stringify(report, null, 2));

    const reportData = await InterviewReport.create({
      user: req.userId,
      resume: resumeContent,
      selfDescription,
      jobDescription,
      ...report,
    });

    res.status(201).json({
      message: "Interview report created successfully",
      reportData,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getReport = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await InterviewReport.findById(id);
    if (!report) {
      return res.status(400).json({ message: "Report not found" });
    }

    res.status(200).json({
      report,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getAllReport = async (req, res) => {
  try {
    const getAllReport = await InterviewReport.find({ user: req.userId });
    res.status(200).json({
      getAllReport
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};
