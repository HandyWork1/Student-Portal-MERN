import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import AdminDashboard from "./assets/AdminDashboard";
import LecturerDashboard from "./assets/LecturerDashboard";
import StudentDashboard from "./assets/StudentDashboard";
import Login from "./assets/Login";
import Register from "./assets/Register";
import "bootstrap/dist/css/bootstrap.min.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/StudentDashboard" element={<StudentDashboard />} />
        <Route path="/LecturerDashboard" element={<LecturerDashboard />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
