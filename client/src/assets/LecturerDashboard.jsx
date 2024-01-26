import React, { useState, useEffect } from "react";
import axios from "axios";
import LogoutAlertModal from "./modals/LogoutAlertModal"
import AddScoresModal from "./modals/AddScoresModal"
import { useNavigate, Link } from "react-router-dom";
import { Table, Card, Button, Row, Col, Spinner } from "react-bootstrap";

const LecturerDashboard = () => {
  
  const [loadingStudents, setLoadingStudents] = useState(true);
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
  const fetchLecturerInfo = async () => {
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
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const lecturerCourseCode = lecturerInfo.courseId;
      if (!lecturerCourseCode) {
        console.error("Lecturer is not assigned to any course.");
        return;
      }

      const response = await axios.get(`http://localhost:7000/api/lecturer/students/${lecturerCourseCode}`);
      
      // Convert the response object into an array of semesters
      const semestersArray = Object.keys(response.data.studentsBySemester).map((semesterName) => {
        const students = response.data.studentsBySemester[semesterName];

        // Calculate additional statistics
        const totalStudents = students.length;
        const avgAssignment1 = calculateAverage(students, 'scores.assignment1');
        const avgAssignment2 = calculateAverage(students, 'scores.assignment2');
        const avgCAT1 = calculateAverage(students, 'scores.cat1');
        const avgCAT2 = calculateAverage(students, 'scores.cat2');
        const avgExam = calculateAverage(students, 'scores.exam');
        
        // Calculate total scores out of 100
        const totalScores = (avgAssignment1 + avgAssignment2 + avgCAT1 + avgCAT2 + avgExam) * 10;

        // Calculate pass/fail counts
        const passCount = students.filter(student => calculateGrade(student.scores.assignment1) !== 'FAIL' && calculateGrade(student.scores.assignment2) !== 'FAIL').length;
        const failCount = totalStudents - passCount;

        return {
          name: semesterName,
          students: students,
          studentCount: totalStudents,
          avgAssignment1: avgAssignment1,
          avgAssignment2: avgAssignment2,
          avgCAT1: avgCAT1,
          avgCAT2: avgCAT2,
          avgExam: avgExam,
          totalScores: totalScores,
          passCount: passCount,
          failCount: failCount,
        };
      });

      console.log(semestersArray);
      // Update state with fetched data
      setSemesterData(semestersArray);
      setStudentsBySemester(semestersArray);
    } catch (error) {
      console.error('Error fetching students for the lecturer:', error.message);
    } finally{
      setLoadingStudents(false);
    }
  };
  // Function to calculate the average of a particular field in an array of objects
  const calculateAverage = (array, field) => {
    const total = array.reduce((acc, student) => acc + student.scores[field], 0);
    return total / array.length || 0; // Avoid division by zero
  };
  // Function to calculate letter grade based on the score
  const calculateGrade = (score) => {
    if (score >= 90) return 'A';
    if (score >= 87) return 'A-';
    if (score >= 84) return 'B+';
    if (score >= 80) return 'B';
    if (score >= 77) return 'B-';
    if (score >= 74) return 'C+';
    if (score >= 70) return 'C';
    if (score >= 67) return 'C-';
    if (score >= 64) return 'D+';
    if (score >= 60) return 'D';
    return 'FAIL';
  };
  // Function to calculate total scores out of 100
  const calculateTotalScores = (scores) => {
    const { assignment1, assignment2, cat1, cat2, exam } = scores;
    const totalScores = (assignment1 + assignment2 + cat1 + cat2 + exam);
    return totalScores > 100 ? 100 : totalScores; // Ensure the total scores do not exceed 100
  };

  // Function to determine the text color based on the grade
  const getTextColor = (grade) => {
    if (grade === 'FAIL') return 'red'; // Set the color for failed grades
    return 'green'; // Set a color for passing grades
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
    fetchStudents();
  }, [lecturerInfo]);

  // Preloader Component
  if (loadingStudents) {
    return (
      <Card className="text-center">
        <Card.Body>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <Card.Text>Loading...</Card.Text>
        </Card.Body>
      </Card>
    );
  }


  return (
      <div className="h-100">
        <div className="row h-100">
          <div className="col-md-3 col-lg-3 col-xl-2 bg-light sidebar vh-100">
            <nav className="navbar navbar-expand-md ">
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
                {semesterData.map((semester, index) => (
                  <div key={index}>
                    <h6 className="sub-header">{`Semester: ${semester.name || 'Unknown Semester'}`}</h6>
                    <p>{`Total Students: ${semester.studentCount}`}</p>
                    <p>{`Average Assignment 1: ${semester.avgAssignment1}`}</p>
                    <p>{`Average Assignment 2: ${semester.avgAssignment2}`}</p>
                    <p>{`Average CAT 1: ${semester.avgCat1}`}</p>
                    <p>{`Average CAT 2: ${semester.avgCat2}`}</p>
                    <p>{`Average Exam: ${semester.avgExam}`}</p>
                    {/* Continue rendering the student table */}
                  </div>
                ))}
                {semesterData.map((semester, index) => (
                  <div key={index}>
                    <h5>{`Semester: ${semester.name || 'Unknown Semester'}`}</h5>
                    {semester.students.map((student, studentIndex) => (
                      <Row>
                        {/* Display Total Students */}
                        <Col md={3}>
                          <Card>
                            <Card.Body>
                              <Card.Title>Total Students</Card.Title>
                              <Card.Text style={{ color: 'blue', fontSize: '24px' }}>{student.studentCount}</Card.Text>
                            </Card.Body>
                          </Card>
                        </Col>

                        {/* Display Average Assignment 1 */}
                        <Col md={3}>
                          <Card>
                            <Card.Body>
                              <Card.Title>Average Assignment 1</Card.Title>
                              <Card.Text style={{ color: getTextColor(calculateGrade(semester.avgAssignment1)), fontSize: '24px' }}>
                                {semester.avgAssignment1}
                              </Card.Text>
                            </Card.Body>
                          </Card>
                        </Col>

                        {/* Display Average Assignment 2 */}
                        <Col md={3}>
                          <Card>
                            <Card.Body>
                              <Card.Title>Average Assignment 2</Card.Title>
                              <Card.Text style={{ color: getTextColor(calculateGrade(semester.avgAssignment2)), fontSize: '24px' }}>
                                {semester.avgAssignment2}
                              </Card.Text>
                            </Card.Body>
                          </Card>
                        </Col>

                        {/* Add more cards for other statistics */}
                      </Row>

                    ))};
                  </div>
                ))}
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
                              <th>Total Scores</th>
                              <th>Grade</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {semester.students.map((student, studentIndex) => (
                              <tr key={studentIndex}>
                                <td>{student.user.name}</td>
                                <td>{student.scores.length > 0 ? student.scores[0].assignment1 : 'N/A'}</td>
                                <td>{student.scores.length > 0 ? student.scores[0].assignment2 : 'N/A'}</td>
                                <td>{student.scores.length > 0 ? student.scores[0].cat1 : 'N/A'}</td>
                                <td>{student.scores.length > 0 ? student.scores[0].cat2 : 'N/A'}</td>
                                <td>{student.scores.length > 0 ? student.scores[0].exam : 'N/A'}</td>
                                <td>{student.scores.length > 0 ? calculateTotalScores(student.scores[0]) : 'N/A'}</td>
                                <td>{student.scores.length > 0 ? calculateGrade(calculateTotalScores(student.scores[0])) : 'N/A'}</td>
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
      </div>
  );
};

export default LecturerDashboard;
