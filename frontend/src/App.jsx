import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Loading from './Loading'
import SignUp from "./SignUp";
import './App.css'
import SessionCheck from "./SessionChecker";
import Messenger from './Messenger'

export default function App({}) {

  return (
    <Router>
      <SessionCheck />
        <Routes>
          <Route path="/m" element={<Messenger />}/>
          <Route path="/m/chat/:userid" element={<Messenger />}/>
          <Route path="/signup" element={<SignUp/>}/>
          <Route path="/loading" element={<Loading>One Moment..</Loading>}/>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      <p style={{color: "rgba(255, 255, 255, 0.5)", textAlign:'center', width: '100%', position: 'absolute', top: "105vh", marginTop: '13vh', zIndex: '-1', userSelect:'none'}}>v.0.0.1</p>
    </Router>
  )
}


