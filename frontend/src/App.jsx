import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Loading from './Loading'
import SignUp from "./SignUp";
import './App.css'

export default function App({}) {

  return (
    <Router>
      <main>
        <Routes>
          <Route path="/signup" element={<SignUp/>}/>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <p style={{color: "rgba(255, 255, 255, 0.5)", textAlign:'center', width: '100%', position: 'absolute', top: "105vh", marginTop: '13vh', zIndex: '-1'}}>v.0.0.1</p>
    </Router>
  )
}


