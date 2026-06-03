import React, { useEffect } from 'react'
import axios from "axios"
import { ServerURL } from '../App'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/Slices/userslice'

const useCurrentUser = () => {
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchCurrentUserData = async()=>{
            try {
                const res = await axios.get(`${ServerURL}/api/auth/current-user` ,{withCredentials:true});
                dispatch(setUserData(res.data))


            } catch (error) {
                console.log("Fetch current User data error", error);

            }
        }
        fetchCurrentUserData();

    },[])

}

export default useCurrentUser
