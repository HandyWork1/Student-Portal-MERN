import React, { useState } from "react";
import axios from "axios";

const LecturerRegistrationForm = ({ onHide }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [courseTeaching, setCourseTeaching] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:7000/api/register", {
        name,
        email,
        password,
        userType: "Lecturer",
        courseId: courseTeaching,
      });
      console.log(response.data); 
      onHide(); 
    } catch (err) {
      setError(err.response.data.error || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="name" style={{ fontWeight: 'bold' }}>Name:</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter Name"
          autoComplete="off"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="email" style={{ fontWeight: 'bold' }}>Email:</label>
        <input
          type="email"
          className="form-control"
          placeholder="Enter Email"
          autoComplete="off"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="password" style={{ fontWeight: 'bold' }}>Password:</label>
        <input
          type="password"
          className="form-control"
          placeholder="Enter Password"
          autoComplete="off"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="courseTeaching" style={{ fontWeight: 'bold' }}>Course Teaching:</label>
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
      <button type="submit" className="btn btn-primary w-100">
        Add Lecturer
      </button>
      {error && <p className="text-danger mt-3">{error}</p>}
    </form>
  );
};

export default LecturerRegistrationForm;
