import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("Student");
  const [courseTeaching, setCourseTeaching] = useState(""); // New state for the course teaching
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Make a POST request to the server
    axios
      .post("http://localhost:7000/register", {
        name,
        email,
        password,
        userType: userType.charAt(0).toUpperCase() + userType.slice(1), // Ensure correct casing
        courseId: userType === "Lecturer" ? courseTeaching : null, // Include courseTeaching only if userType is "Lecturer"
      })
      .then((result) => console.log(result)) // Log the result if the request is successful
      .catch((err) => console.log(err)); // Log any errors

    // Navigate to the "/" route after the request (regardless of success or failure)
    navigate("/");
  };

  // Function to conditionally render the course teaching input
  const renderCourseTeachingInput = () => {
    if (userType === "Lecturer") {
      return (
        <div className="mb-3">
          <label htmlFor="courseTeaching">
            <strong>Course Teaching:</strong>
          </label>
          <input
            type="text"
            placeholder="Enter Course"
            autoComplete="off"
            name="courseTeaching"
            className="form-control rounded-0"
            value={courseTeaching}
            onChange={(e) => setCourseTeaching(e.target.value)}
          />
        </div>
      );
    }
    return null; // If userType is not "Lecturer", return null (no input field)
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name">
              <strong>Name:</strong>
            </label>
            <input
              type="text"
              placeholder="Enter Name"
              autoComplete="off"
              name="name"
              className="form-control rounded-0"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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

          <div className="mb-3">
            <label htmlFor="userType">
              <strong>User Type:</strong>
            </label>
            <select
              className="form-control rounded-0"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              name="userType" // Include the name attribute for the select element
            >
              <option value="Student">Student</option>
              <option value="Admin">Admin</option>
              <option value="Lecturer">Lecturer</option>
            </select>
          </div>

          {/* Conditionally render the course teaching input */}
          {renderCourseTeachingInput()}

          <button type="submit" className="btn btn-success w-100 rounded-0">
            Sign Up
          </button>

          <br />
          <p>Already have an account?</p>
          <Link to="/">
            <button className="btn btn-default border w-100 bg-light rounded text-decoration-none">
              Login
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Signup;
