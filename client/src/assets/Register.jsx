import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("Student");
  const [courseTeaching, setCourseTeaching] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:7000/api/register", {
        name,
        email,
        password,
        userType: userType.charAt(0).toUpperCase() + userType.slice(1),
        courseId: userType === "Lecturer" ? courseTeaching : null,
      });
      console.log(response.data); // Log successful registration response
      // Redirect to login 
      navigate('/login');
    } catch (err) {
      setError(err.response.data.error || "Something went wrong");
    }
  };

  const renderCourseTeachingInput = () => {
    if (userType === "Lecturer") {
      return (
        <div className="mb-3">
          <label htmlFor="courseTeaching">Course Teaching:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Course Teaching"
            autoComplete="off"
            name="courseTeaching"
            value={courseTeaching}
            onChange={(e) => setCourseTeaching(e.target.value)}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4">
            <h2 className="text-center mb-4">Sign Up</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  autoComplete="off"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  autoComplete="off"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  autoComplete="off"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <select
                  className="form-select"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  name="userType"
                >
                  <option value="Student">Student</option>
                  <option value="Admin">Admin</option>
                  <option value="Lecturer">Lecturer</option>
                </select>
              </div>
              {renderCourseTeachingInput()}
              <button type="submit" className="btn btn-primary w-100">
                Sign Up
              </button>
              {error && <p className="text-danger mt-3">{error}</p>}
              <p className="mt-3 text-center">
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
