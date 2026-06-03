import React from 'react'
import {  Navigate, Route, Routes } from 'react-router-dom'
import Register from '../pages/Register'
import Login from '../pages/Login'
import Home from '../pages/Home'
import { useSelector } from 'react-redux'

const RouteApp = () => {
  const {userData} = useSelector((state)=>state.user);

  // console.log("this is userData",userdata);
  return (
    <Routes>
        <Route path='/' element={userData?<Home />:<Navigate to="/login" />}   />
        <Route path='/register' element={!userData?<Register/>:<Navigate to="/" />}   />
        <Route path='/login' element={!userData?<Login/>:<Navigate to="/" />}   />

    </Routes>
  )
}

export default RouteApp
