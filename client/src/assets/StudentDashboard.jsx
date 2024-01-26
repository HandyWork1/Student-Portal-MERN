import React, { useState, useEffect } from "react";
import axios from "axios";
import { Accordion, Card, Table, Button} from "react-bootstrap";
import RegistrationAlertModal from "./modals/RegistrationAlertModal"
import LogoutAlertModal from "./modals/LogoutAlertModal"
import {Link} from "react-router-dom"

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("semester1");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedCoursesCount, setSelectedCoursesCount] = useState(0);
  const [studentName, setStudentName] = useState("");
  const [error, setError] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [showRegistrationAlert, setShowRegistrationAlert] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [scoresBySemester, setScoresBySemester] = useState([{}]);
  const [activeItem, setActiveItem] = useState("dashboard");

  // Fetch courses for registration
  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:7000/api/course");
      setCourses(response.data.courses);
    } catch (error) {
      console.error("Error fetching courses:", error.message);
    }
  };

  // Fetch courses registered by student
  const fetchRegisteredCourses = async () => {
    try {
      const userDetails = JSON.parse(localStorage.getItem('userDetails'));
      const userId = userDetails?.userId;

      const response = await axios.get(`http://localhost:7000/api/student/courses/${userId}`);
      if (response.data && response.data.courses) {
        setRegisteredCourses(response.data.courses);
      } else {
        setRegisteredCourses([]); // Set an empty array if no courses are found
      }
    } catch (error) {
      console.error('Error fetching registered courses:', error.message);
      setRegisteredCourses([]); // Set an empty array on error
    }
  };
  // Group Courses by Semester
  const groupedCoursesBySemester = registeredCourses.reduce((acc, course) => {
    if (!acc[course.semester]) {
      acc[course.semester] = [];
    }
    acc[course.semester].push(course);
    return acc;
  }, {});


  // Course selection for each semester
  const handleSemesterSelection = (semester) => {
    setSelectedSemester(semester);
    setSelectedCourses([]);
  };

  // Course selection ensuring student registers at least 5 courses
  const handleCourseSelection = (courseCode) => {
    if (selectedCoursesCount < 5) {
      if (selectedCourses.includes(courseCode)) {
        setSelectedCoursesCount(selectedCoursesCount - 1);
        setSelectedCourses(selectedCourses.filter((code) => code !== courseCode));
      } else {
        setSelectedCoursesCount(selectedCoursesCount + 1);
        setSelectedCourses([...selectedCourses, courseCode]);
      }
    }
  };

  // Course registration for student
  const registerCourses = async () => {
    try {
      const userDetails = JSON.parse(localStorage.getItem("userDetails"));
      const userId = userDetails?.userId; 

      const response = await axios.post("http://localhost:7000/api/register-courses", {
        userId,
        semester: selectedSemester,
        courses: selectedCourses,
      });

      // Reset selected courses and count after successful registration
      setSelectedCourses([]);
      setSelectedCoursesCount(0);
      setShowRegistrationAlert(true);
    } catch (error) {
      console.error("Error registering courses:", error.message);
      setError("Error registering courses");
    }
  };

  // Fetch scores for the student
  const fetchScores = async () => {
    try {
      const userId = userDetails?.userId;
  
      const response = await axios.get(`http://localhost:7000/api/student/scores/${userId}`);
      const { studentCourses } = response.data;
  
      // Group courses by semester
      const groupedCoursesBySemester = studentCourses.reduce((acc, course) => {
        const { semester, course: courseData, scores } = course;
  
        if (!acc[semester]) {
          acc[semester] = { semester, courses: [] };
        }
  
        acc[semester].courses.push({ courseData, scores });
        return acc;
      }, {});
  
      // Convert the object to an array
      const groupedCoursesBySemesterArray = Object.values(groupedCoursesBySemester);
  
      setScoresBySemester(groupedCoursesBySemesterArray);
    } catch (error) {
      console.error('Error fetching scores:', error.message);
    }
  };
  


  
  // Remove Selected Courses
  const removeSelectedCourse = (courseCode) => {
    setSelectedCoursesCount(selectedCoursesCount - 1);
    setSelectedCourses(selectedCourses.filter((code) => code !== courseCode));
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
    // Retrieve the object from local storage
    const storedUserDetails = JSON.parse(localStorage.getItem("userDetails"));

    // Set the userDetails state with the retrieved object
    if (storedUserDetails) {
      setUserDetails(storedUserDetails);
    }

  }, []);

  useEffect(() => {
    if (activeItem === "registeredCourses") {
       // Fetch courses callback
     fetchRegisteredCourses();
     console.log("new registered courses", registeredCourses);
    }
    if (activeItem === "viewScores") {
       // Fetch courses callback
     fetchScores();
     console.log(scoresBySemester);
    }
  }, [activeItem]);

  useEffect(() => {
    fetchCourses();
  }, [selectedSemester]);

  return (
    <div className="h-100">
      <div className="row h-100">
        {/* Sidebar */}
        <div className="col-lg-3 col-md-3 col-xl-2 bg-light sidebar vh-100">
          <nav className="navbar navbar-expand-md">
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
            <div className=" py-4 collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav flex-column mt-4">
                <div className="container-fluid">              
                  <div className="mb-4">
                    <h3>Student Dashboard</h3>
                  </div>
                  <li className="nav-item">
                    <Link
                      to="#"
                      className={`nav-link ${
                        activeItem === "dashboard" ? "active" : ""
                      }`}
                      onClick={() => handleSidebarItemClick("dashboard")}
                    >
                      <i className="fas fa-tachometer-alt me-2"></i> Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="#"
                      className={`nav-link ${
                        activeItem === "registeredCourses" ? "active" : ""
                      }`}
                      onClick={() => handleSidebarItemClick("registeredCourses")}
                    >
                      <i className="fas fa-graduation-cap me-2"></i> Registered Courses
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                        to="#"
                        className={`nav-link ${
                          activeItem === "viewScores" ? "active" : ""
                        }`}
                        onClick={() => handleSidebarItemClick("viewScores")}
                      >
                        <i className="fas fa-chart-bar me-2"></i> View Scores
                      </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="#" className="nav-link" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt me-2"></i> Logout
                    </Link>
                  </li>
                </div>
              </ul>
            </div>
          </nav>
        </div>
        {/* Display the registration alert modal */}
        <RegistrationAlertModal
          show={showRegistrationAlert}
          onHide={() => setShowRegistrationAlert(false)}
        />
        {/* Display Logout alert modal */}
        <LogoutAlertModal
          show={showLogoutModal}
          onHide={handleClose}
        />

        {/* Main Content */}
        <div className="col-md-8 mt-3">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-5">
                <div className="card bg-light text-center">
                  <div className="card-body">
                    <h5 className="card-title">Welcome, {userDetails ? userDetails.name : 'Guest'}</h5>
                  </div>
                </div>
              </div>
            </div>
            {activeItem === "dashboard" && (
            <div id="dashboard">          
              <div className="card bg-light my-4">
                <div className="card-header">
                  <div className="row">
                    <div className="col-lg-2 col-md-3">
                      <label htmlFor="semesterSelect" className="form-label">Select Semester</label>
                    </div>
                    <div className="col-lg-3 col-md-4">
                      <select
                        id="semesterSelect"
                        className="form-select form-select-sm"
                        value={selectedSemester}
                        onChange={(e) => handleSemesterSelection(e.target.value)}
                        style={{ width: 'auto' }}
                      >
                        <option value="semester1">Semester 1</option>
                        <option value="semester2">Semester 2</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="mb-4">
                    <h4>Available Courses</h4>
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>Code</th>
                          <th>Name</th>
                          <th>Description</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {courses.map((course) => (
                          <tr key={course.code}>
                            <td>{course.code}</td>
                            <td>{course.name}</td>
                            <td>{course.description}</td>
                            <td>
                              <Button
                                variant="primary"
                                onClick={() => handleCourseSelection(course.code)}
                                disabled={
                                  selectedCourses.includes(course.code) ||
                                  selectedCourses.length >= 5
                                }
                              >
                                {selectedCourses.includes(course.code)
                                  ? "Course Added"
                                  : "Add Course"}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </div>
              <div className="card bg-light mb-2">
                <div className="card-body">
                  <div>
                    <h4 className="card-title">Selected Courses</h4>
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>Code</th>
                          <th>Name</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCourses.map((courseCode, index) => (
                          <tr key={`${courseCode}-${index}`}>
                            <td>{courseCode}</td>
                            <td>
                              {/* Display course name based on courseCode */}
                              {courses.find((course) => course.code === courseCode)?.name}
                            </td>
                            <td>
                              <Button
                                variant="danger"
                                onClick={() => removeSelectedCourse(courseCode)}
                              >
                                Remove
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>

                  <div>
                    <Button
                      variant="primary"
                      onClick={registerCourses}
                      disabled={selectedCourses.length === 0 || selectedCoursesCount < 5}
                    >
                      Register Selected Courses
                    </Button>
                    {error && <p className="text-danger mt-3">{error}</p>}
                  </div>
                </div>
              </div>
            </div>
            )}
            {activeItem === "registeredCourses" && (
              <div id="registeredCourses">
                <h2 className="mt-4 mb-3">Registered Courses</h2>
                {/* Display registered courses per semester */}
                {Object.entries(groupedCoursesBySemester).map(([semester, courses]) => (
                  <div className="accordion mb-5" key={semester}>
                    <div className="accordion-item">
                      <h2 className="accordion-header" id={`heading-${semester}`}>
                        <button
                          className="accordion-button"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#collapse-${semester}`}
                          aria-expanded="true"
                          aria-controls={`collapse-${semester}`}
                        >
                          {`Semester: ${semester || 'Unknown Semester'}`}
                        </button>
                      </h2>
                      <div
                        id={`collapse-${semester}`}
                        className="accordion-collapse show"
                        aria-labelledby={`heading-${semester}`}
                      >
                        <div className="accordion-body">
                          {courses.map((course) => (
                            <div className="card mb-3" key={course._id}>
                              <div className="card-body">
                                <h5 className="card-title">{course.course.code}</h5>
                                <p className="card-text">{course.course.name}</p>
                                {/* Add other course details as needed */}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeItem === 'viewScores' && (
              <div id="viewScores">
                <h2 className="mt-4 mb-3">View Scores</h2>

                {/* Display scores grouped by semester in an accordion */}
                {scoresBySemester.length === 0 ? (
                  <p>No scores available for the selected semesters.</p>
                ) : (
                  <div id="accordion" >
                    {Object.entries(groupedCoursesBySemester).map(([semester, courses]) => (
                      <div className="accordion mb-4" key={semester}>
                        <div className="accordion-item">
                          <h5 className="accordion-header" id={`heading-${semester}`}>
                            <button
                              className="accordion-button"
                              type="button"
                              data-toggle="collapse"
                              data-target={`#collapse-${semester}`}
                              aria-expanded="true"
                              aria-controls={`collapse-${semester}`}
                            >
                              {`Semester: ${semester || 'Unknown Semester'}`}
                            </button>
                          </h5>
                          <div
                            id={`collapse-${semester}`}
                            className="accordion-collapse show"
                            aria-labelledby={`heading-${semester}`}
                            data-parent="#accordion"

                          >
                            <div className="accordion-body">
                              <Table striped bordered hover responsive>
                                <thead>
                                  <tr>
                                    <th>Course Code</th>
                                    <th>Course Name</th>
                                    <th>Assignment 1</th>
                                    <th>Assignment 2</th>
                                    <th>CAT 1</th>
                                    <th>CAT 2</th>
                                    <th>Exam</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {courses.map((courseData) => (
                                    <tr key={courseData._id}>
                                      <td>{courseData.course.code}</td>
                                      <td>{courseData.course.name}</td>
                                      <td>{courseData.scores.length > 0 ? courseData.scores[0].assignment1 : 'N/A'}</td>
                                      <td>{courseData.scores.length > 0 ? courseData.scores[0].assignment2 : 'N/A'}</td>
                                      <td>{courseData.scores.length > 0 ? courseData.scores[0].cat1 : 'N/A'}</td>
                                      <td>{courseData.scores.length > 0 ? courseData.scores[0].cat2 : 'N/A'}</td>
                                      <td>{courseData.scores.length > 0 ? courseData.scores[0].exam : 'N/A'}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}


          </div>
        </div>
        
      </div>
    </div>
    
  );
};

export default StudentDashboard;
