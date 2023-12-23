import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Add error state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:7000/api/login", {
        email,
        password,
      });
      
      const token = response.data.token;
      localStorage.setItem("token", token);
      
      const userDetails = response.data.userDetails; // Retrieve user details
      localStorage.setItem("userDetails", JSON.stringify(userDetails)); // Store user details


      if (userDetails.userType === "Student") {
        navigate("/StudentDashboard");
      } else if (userDetails.userType === "Admin") {
        navigate("/AdminDashboard");
      } else if (userDetails.userType === "Lecturer") {
          navigate("/LecturerDashboard");   
        } else {
          console.log("Invalid user type");
      }
    } catch (err) {
      setError(err.response.data.error || "Something went wrong");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4">
            <h2 className="text-center mb-4">Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  <strong>Email:</strong>
                </label>
                <input
                  type="text"
                  placeholder="Enter Email"
                  autoComplete="off"
                  name="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  <strong>Password:</strong>
                </label>
                <input
                  type="password"
                  placeholder="Enter password"
                  autoComplete="off"
                  name="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Login
              </button>
              {error && <p className="text-danger mt-3">{error}</p>}
              <p className="mt-3 text-center">
                Don't have an account? <Link to="/register">Sign Up</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
