import mongoose from "mongoose";

const interviewReportSchema = new mongoose.Schema(
  {
    jobDescription: {
      type: String,
      required: true,
    },
    selfDescription: {
      type: String,
    },
    resume: {
      type: String,
    },

    matchScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    technicalQuestion: [
      {
        question: {
          type: String,
          required: true,
        },
        intension: {
          type: String,
          required: true,
        },
        answer: {
          type: String,
          required: true,
        },
      },
    ],

    behaviorQuestion:[
        {
        question: {
          type: String,
          required: true,
        },
        intension: {
          type: String,
          required: true,
        },
        answer: {
          type: String,
          required: true,
        },
      },

    ],

    skillGap:[
        {
            skill:{
                type:String,
                required:true
            },
            severity:{
                type:String,
                enum:["low" ,"med" ,"high"],
                required:true
            }

        }
    ]
 ,
    preparationPlan:[
        {
            day:{
                type:Number ,
                required:true
            },
            focus:{
                type:String
            },
            tasks:[{
                type:String,
                required:true
            }]
        }
    ],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }


  },
  { timestamps: true },
);


const InterviewReport = mongoose.model("InterviewReport" , interviewReportSchema);

export default InterviewReport;
