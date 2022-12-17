import React, { useState } from 'react'
import axios from 'axios'
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
// import NoteState from './context/notes/NoteState';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";




const App = () => {
  return (
    <>
    
      <Router>
        <Navbar />
        <div className='container'>
        <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home/>}/>
        </Routes>
        </div>
      </Router>
      
    </>
  );
}

export default App
