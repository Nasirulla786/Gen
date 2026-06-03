import {configureStore }from "@reduxjs/toolkit"
import userSlice from "./Slices/userslice"



export const Store = configureStore({
    reducer:{
        user:userSlice

    }

})
