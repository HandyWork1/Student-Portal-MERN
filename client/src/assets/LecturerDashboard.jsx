import React, { useState, useEffect } from "react";
import axios from "axios";
import ScoresDisplay from "./ScoresDisplay";
import { useNavigate, Link } from "react-router-dom";

const LecturerDashboard = () => {
  const [formData, setFormData] = useState({
    studentName: "",
    assignment1: 0,
    assignment2: 0,
    cat1: 0,
    cat2: 0,
    exam: 0,
  });

  const [scores, setScores] = useState([]);
  const [showScores, setShowScores] = useState(false);
  const [lecturerInfo, setLecturerInfo] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:7000/api/scores", formData);
      alert("Score saved successfully.");
      fetchScores();
    } catch (error) {
      console.error("Error saving score:", error.message);
    }
  };

  const fetchScores = async () => {
    try {
      const response = await axios.get("http://localhost:7000/api/scores");
      setScores(response.data.scores);
    } catch (error) {
      console.error("Error fetching scores:", error.message);
    }
  };

  const fetchLecturerInfo = async () => {
    try {
      const response = await axios.get("http://localhost:7000/lecturers");
      const lecturers = response.data.lecturers.filter(
        (lecturer) => lecturer.courseId === "APT1050"
      );
      setLecturerInfo(lecturers);
    } catch (error) {
      console.error("Error fetching lecturer information:", error.message);
    }
  };

   // Function to handle logout
   const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userDetails");
    navigate("/login");
  };

  useEffect(() => {
    // Retrieve the object from local storage
    const storedUserDetails = JSON.parse(localStorage.getItem("userDetails"));

    // Set the userDetails state with the retrieved object
    if (storedUserDetails) {
      setUserDetails(storedUserDetails);
    }
  }, []);

  useEffect(() => {
    fetchScores();
    fetchLecturerInfo();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
      <div className="col-md-3 col-lg-2 bg-primary">
        <nav className="navbar navbar-expand-md navbar-light sidebar">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="py-4 collapse navbar-collapse" id="navbarNav">
          
            <ul className="navbar-nav flex-column mt-4">
              <div className="text-light mb-4">
                <h3>Lecturer Dashboard</h3>
              </div>
              <li className="nav-item mb-3">
                <Link to="#" className="nav-link text-light">
                  <i className="fas fa-user-graduate me-2"></i> Students
                </Link>
              </li>
              <li className="nav-item mb-3">
                <Link to="#" className="nav-link text-light">
                  <i className="fas fa-cog me-2"></i> Settings
                </Link>
              </li>
              <li className="nav-item">
                <a to="#" className="nav-link text-light" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt me-2"></i> Logout
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

        <main role="main" className="col-md-9 ml-sm-auto col-lg-9 px-4">
          <h2 className="mt-4">Welcome, {userDetails ? userDetails.name : 'Guest'}!</h2>

          <div className="mb-4">
            {lecturerInfo.map((lecturer, index) => (
              <div key={index}>
                <p>Course Teaching: {lecturer.courseId}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="studentName" className="form-label">
                Student Name:
              </label>
              <input
                type="text"
                className="form-control"
                id="studentName"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="assignment1" className="form-label">
                Assignment 1:
              </label>
              <input
                type="number"
                className="form-control"
                id="assignment1"
                name="assignment1"
                value={formData.assignment1}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="assignment2" className="form-label">
                Assignment 2:
              </label>
              <input
                type="number"
                className="form-control"
                id="assignment2"
                name="assignment2"
                value={formData.assignment2}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="cat1" className="form-label">
                CAT 1:
              </label>
              <input
                type="number"
                className="form-control"
                id="cat1"
                name="cat1"
                value={formData.cat1}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="cat2" className="form-label">
                CAT 2:
              </label>
              <input
                type="number"
                className="form-control"
                id="cat2"
                name="cat2"
                value={formData.cat2}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="exam" className="form-label">
                Exam:
              </label>
              <input
                type="number"
                className="form-control"
                id="exam"
                name="exam"
                value={formData.exam}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>

          <button
            className="btn btn-secondary mt-3"
            onClick={() => setShowScores(!showScores)}
          >
            {showScores ? "Hide Scores" : "Show Scores"}
          </button>

          {showScores && <ScoresDisplay scores={scores} />}
        </main>
      </div>
    </div>
  );
};

export default LecturerDashboard;
