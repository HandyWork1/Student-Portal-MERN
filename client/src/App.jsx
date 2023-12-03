import { useState } from "react";
import AdminDashboard from "./assets/AdminDashboard";
import LecturerDashboard from "./assets/LecturerDashboard";
import StudentDashboard from "./assets/StudentDashboard";
import Login from "./assets/Login";
import Register from "./assets/Register";
import "bootstrap/dist/css/bootstrap.min.css";
import GRMDashboard from "./assets/GRMDashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/StudentDashboard" element={<StudentDashboard />} />
        <Route path="/LecturerDashboard" element={<LecturerDashboard />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/GRMDashboard" element={<GRMDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
