import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:7000/", { email, password })
      .then((result) => {
        console.log(result);
        const userType = result.data.userType;

        if (userType === "Student") {
          navigate("/StudentDashboard");
        } else if (userType === "Admin") {
          navigate("/AdminDashboard");
        } else if (userType === "Lecturer") {
          // Check if the lecturer teaches APT1050 or GRM2000
          const coursesTeaching = result.data.courseId || [];

          if (coursesTeaching.includes("APT1050")) {
            navigate("/LecturerDashboard");
          } else if (coursesTeaching.includes("GRM2000")) {
            navigate("/GRMDashboard");
          } else {
            console.log("Invalid courses for Lecturer");
          }
        } else {
          // Handle other user types or errors here
          console.log("Invalid user type");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email:</strong>
            </label>
            <input
              type="text"
              placeholder="Enter Email"
              autoComplete="off"
              name="email"
              className="form-control rounded-0"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password:</strong>
            </label>
            <input
              type="password"
              placeholder="Enter password"
              autoComplete="off"
              name="password"
              className="form-control rounded-0"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 rounded-0">
            Login
          </button>

          <br />
          <p>Don't have an account?</p>
          <Link to="/register">
            <button className="btn btn-default border w-100 bg-light rounded text-decoration-none">
              Sign Up
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
