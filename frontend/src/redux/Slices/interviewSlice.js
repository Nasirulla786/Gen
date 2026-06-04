import { createSlice } from "@reduxjs/toolkit";

const interviewSlice = createSlice({
    name:"interview data",
    initialState:{
        interviewReport:null
    },
    reducers:{
        setInterviewReport :(state , action)=>{
            state.interviewReport = action.payload;

        }
    }
})


export const {setInterviewReport} = interviewSlice.actions;
export default interviewSlice.reducer
