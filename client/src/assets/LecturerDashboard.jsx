import React, { useState, useEffect } from "react";
import axios from "axios";
import LogoutAlertModal from "./modals/LogoutAlertModal"
import AddScoresModal from "./modals/AddScoresModal"
import { useNavigate, Link } from "react-router-dom";
import { Table, Card, Button } from "react-bootstrap";

const LecturerDashboard = () => {
  // const [formData, setFormData] = useState({
  //   assignment1: 0,
  //   assignment2: 0,
  //   cat1: 0,
  //   cat2: 0,
  //   exam: 0,
  // });

  const [showAddScoresModal, setShowAddScoresModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [lecturerInfo, setLecturerInfo] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");
  const [semesterData, setSemesterData] = useState([]);
  const [studentsBySemester, setStudentsBySemester] = useState([]);
  const navigate = useNavigate();

  // Opening adding scores modal
  const handleShowAddScoresModal = (student) => {
    setSelectedStudent(student);
    setShowAddScoresModal(true);
  };

  const handleCloseAddScoresModal = () => {
    setShowAddScoresModal(false);
    setSelectedStudent(null);
  };

  // Get Lecturer details and save in localStorage
  const fetchLecturerInfo = () => {
    try {
      // Retrieve the object from local storage
      const storedUserDetails = JSON.parse(localStorage.getItem("userDetails"));

      if (!storedUserDetails) {
        console.error("User details not found in local storage.");
        return;
      }

      // Use stored userDetails directly
      setLecturerInfo(storedUserDetails);
    } catch (error) {
      console.error("Error fetching lecturer information:", error.message);
    }
  };

  // Fetch students registered for the course
  const fetchStudents = async () => {
    try {
      const lecturerCourseCode = lecturerInfo.courseId; // Assuming you have courseCode in lecturerInfo
      if (!lecturerCourseCode) {
        console.error("Lecturer is not assigned to any course.");
        return;
      }
  
      const response = await axios.get(`http://localhost:7000/api/lecturer/students/${lecturerCourseCode}`);
      // Convert the response object into an array of semesters
      const semestersArray = Object.keys(response.data.studentsBySemester).map((semesterName) => ({
        name: semesterName,
        students: response.data.studentsBySemester[semesterName],
      }));

      // Update state with fetched data
      setSemesterData(semestersArray);
      setStudentsBySemester(semestersArray);
    } catch (error) {
      console.error('Error fetching students for the lecturer:', error.message);
    }
  };
  
  // Function to handle logout
  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  // Function to close modal
  const handleClose = () => {
    setShowLogoutModal(false);
  };
  
  // Function to handle sidebar item click
  const handleSidebarItemClick = (item) => {
    setActiveItem(item);
  };

  useEffect(() => {
    fetchLecturerInfo();
  }, []);

  useEffect(() => {
    if (activeItem === "students") {
      // Fetch students callback
     fetchStudents();
    }
  }, [activeItem]);


  return (
    <div className="row">
      <div className="col-md-3 col-lg-3">
        <nav className="navbar navbar-expand-md bg-light">
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
              <div className="container-fluid">
                <div className="mb-4">
                  <h3>Lecturer Dashboard</h3>
                </div>
                <li className="nav-item">
                  <Link
                    to="#"
                    className={`nav-link ${
                      activeItem === "dashboard" ? "active" : ""
                    }`}
                    onClick={() => handleSidebarItemClick("dashboard")}
                  >
                    <i className="fas fa-tachometer-alt mx-2 pl-2"></i> Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="#" 
                    className={`nav-link ${
                      activeItem === "students" ? "active" : ""
                    }`}
                    onClick={() => handleSidebarItemClick("students")}
                    >
                    <i className="fas fa-user-graduate mx-2"></i> Students
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="#" 
                    className={`nav-link ${
                        activeItem === "settings" ? "active" : ""
                      }`}
                      onClick={() => handleSidebarItemClick("settings")}
                      >
                    <i className="fas fa-cog mx-2"></i> Settings
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="#" className="nav-link" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt mx-2"></i> Logout
                  </Link>
                </li>
              </div>
            </ul>
          </div>
        </nav>
      </div>
      {/* Display Logout alert modal */}
      <LogoutAlertModal
        show={showLogoutModal}
        onHide={handleClose}
      />
      {/* Display Adding scores modal */}
      <AddScoresModal
        show={showAddScoresModal}
        handleClose={handleCloseAddScoresModal}
        fetchStudents={fetchStudents}
        student={selectedStudent}
      />
        <main role="main" className="col-md-9 ml-sm-auto col-lg-9 px-4 mt-3">
          <div className="container-fluid">
          <div className="col-lg-5">
            <div className="card bg-light text-center">
              <div className="card-body">
                <h5 className="card-title">Welcome, {lecturerInfo ? lecturerInfo.name : 'Guest'}</h5>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <div>
              <p className="sub-header">Course Teaching: {lecturerInfo.courseId}</p>
            </div>
          </div>
          {/* Dashboard */}
          {activeItem === "dashboard" && (
            <div id="dashboard">
              <h3>Dashboard</h3>
            </div>
            
          )}
          {activeItem === "students" && (
            <div id="students">
              <Card>
                <Card.Body>
                  <Card.Title>Registered Students</Card.Title>

                  {semesterData.map((semester, index) => (
                    <div key={index}>
                      <h6 className="sub-header">{`Semester: ${semester.name || 'Unknown Semester'}`}</h6>
                      <Table striped bordered hover responsive>
                        <thead>
                          <tr>
                            <th>Student Name</th>
                            <th>Assignment 1</th>
                            <th>Assignment 2</th>
                            <th>CAT 1</th>
                            <th>CAT 2</th>
                            <th>Exam</th>
                            <th>Action</th>
                            {/* Add more columns as needed */}
                          </tr>
                        </thead>
                        <tbody>
                          {semester.students.map((student, studentIndex) => (
                            <tr key={studentIndex}>
                              <td>{student.user.name}</td>
                              <td>{student.scores.assignment1}</td>
                              <td>{student.scores.assignment2}</td>
                              <td>{student.scores.cat1}</td>
                              <td>{student.scores.cat2}</td>
                              <td>{student.scores.exam}</td>
                              <td>
                                <Button
                                  variant="primary"
                                  onClick={() => handleShowAddScoresModal(student)}
                                  disabled={student.scores && Object.keys(student.scores).length !== 0}
                                >
                                  Add Scores
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </div>
          )}
          {activeItem === "settings" && (
            <div id="settings">
              <h3>Settings</h3>
            </div>
            
          )}
        </div>
      </main>
    </div>
  );
};

export default LecturerDashboard;
