import {configureStore }from "@reduxjs/toolkit"
import userSlice from "./Slices/userslice"
import interviewSlice from "./Slices/interviewSlice"



export const Store = configureStore({
    reducer:{
        user:userSlice,
        interview:interviewSlice
    }

})
