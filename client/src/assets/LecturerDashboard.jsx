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
  const [selectedSemester, setSelectedSemester] = useState("");
  const [studentsBySemester, setStudentsBySemester] = useState([]);
  const navigate = useNavigate();

  // Function to handle semester selection
  const handleSemesterSelect = (event) => {
    setSelectedSemester(event.target.value);
  };
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
        console.log("Students object", students);
        
        // Calculate additional statistics
        const totalStudents = students.length;
        
        // Calculate total scores out of 100 for each student
        const studentsWithTotalScores = students.map(student => {
          const totalScores = student.scores ? calculateTotalScores(student.scores[0]) : 0;
          return {
            ...student,
            totalScores: totalScores,
          };
        });
        console.log("Student with scores", studentsWithTotalScores);
        const avgAssignment1 = calculateAverage(studentsWithTotalScores, 'assignment1');
        const avgAssignment2 = calculateAverage(studentsWithTotalScores, 'assignment2');
        const avgCAT1 = calculateAverage(studentsWithTotalScores, 'cat1');
        const avgCAT2 = calculateAverage(studentsWithTotalScores, 'cat2');
        const avgExam = calculateAverage(studentsWithTotalScores, 'exam');
        const totalClassScores = calculateTotalClassScores(studentsWithTotalScores);
        const classAverage = totalClassScores / studentsWithTotalScores.filter(student => {
          return student.totalScores !== undefined;
        }).length

        // Calculate pass/fail counts
        const passCount = studentsWithTotalScores.filter(student => {
          return student.totalScores !== undefined && calculateGrade(student.totalScores) !== 'FAIL';
        }).length;

        const failCount = studentsWithTotalScores.filter(student => {
          return student.totalScores !== undefined && calculateGrade(student.totalScores) === 'FAIL';
        }).length;


        return {
          name: semesterName,
          students: studentsWithTotalScores,
          studentCount: totalStudents,
          avgAssignment1: avgAssignment1,
          avgAssignment2: avgAssignment2,
          avgCAT1: avgCAT1,
          avgCAT2: avgCAT2,
          avgExam: avgExam,
          totalClassScores: totalClassScores,
          classAverage: classAverage,
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
    } finally {
      setLoadingStudents(false);
    }
  };

// Function to calculate the average of a particular field in an array of objects
const calculateAverage = (array, field) => {
  // Filter out students without scores for the specified field
  const studentsWithScores = array.filter(student => student.scores && student.scores.length > 0 && student.scores[0][field] !== undefined);

  // Calculate the average only for students with scores
  const total = studentsWithScores.reduce((acc, student) => acc + student.scores[0][field], 0);

  return total / studentsWithScores.length || 0; // Avoid division by zero
};

  // Function to calculate letter grade based on the score
  const calculateGrade = (score) => {
    if (score === undefined) return 'N/A';
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
    if (!scores) {
      return undefined;
    }
  
    const { assignment1 = 0, assignment2 = 0, cat1 = 0, cat2 = 0, exam = 0 } = scores;
    const totalScores = assignment1 + assignment2 + cat1 + cat2 + exam;
    return totalScores > 100 ? 100 : totalScores; // Ensure the total scores do not exceed 100
  };
  // Function to calculate the sum of total scores for all students with scores
  const calculateTotalClassScores = (array) => {
    const studentsWithScores = array.filter(student => student.totalScores !== undefined);
    return studentsWithScores.reduce((acc, student) => acc + student.totalScores, 0);
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
                  {/* Semester Dropdown */}
                  <div className="mb-3">
                    <label htmlFor="semesterDropdown" className="mr-2">
                      Select Semester:
                    </label>
                    <select
                      id="semesterDropdown"
                      className="form-select"
                      value={selectedSemester}
                      onChange={handleSemesterSelect}
                    >
                      <option value="">All Semesters</option>
                      {semesterData.map((semester, index) => (  
                        <option key={index} value={semester.name}>
                          {semester.name || 'Unknown Semester'}
                        </option>
                      ))}
                    </select>
                  </div>
                  {semesterData.map((semester, index) => (
                    <div key={index}>
                      {(!selectedSemester || selectedSemester === semester.name) && (
                        <React.Fragment>
                          <h6 className="sub-header">{`Semester: ${semester.name === 'semester1' ? 'Semester 1' : 'Semester 2'|| 'Unknown Semester'}`}</h6>
                          {console.log("semester data", semester)}
                          <Row>
                            
                            {/* Display Total Students */}
                            <Col md={3}>
                              <Card>
                                <Card.Body>
                                  <Card.Title>Total Students</Card.Title>
                                  <Card.Text style={{ color: 'blue', fontSize: '24px' }}>{semester.studentCount}</Card.Text>
                                </Card.Body>
                              </Card>
                            </Col>
                            {/* Display Pass Count */}
                            <Col md={3}>
                              <Card>
                                <Card.Body>
                                  <Card.Title>Pass Count</Card.Title>
                                  <Card.Text style={{ color: 'blue', fontSize: '24px' }}>
                                    {semester.passCount}
                                  </Card.Text>
                                </Card.Body>
                              </Card>
                            </Col>
                            {/* Display Fail Count */}
                            <Col md={3}>
                              <Card>
                                <Card.Body>
                                  <Card.Title>Fail Count</Card.Title>
                                  <Card.Text style={{ color: 'red', fontSize: '24px' }}>
                                    {semester.failCount}
                                  </Card.Text>
                                </Card.Body>
                              </Card>
                            </Col>  
                            {/* Display Fail Count */}
                            <Col md={3}>
                              <Card>
                                <Card.Body>
                                  <Card.Title>Class Average</Card.Title>
                                  <Card.Text style={{ color: getTextColor(calculateGrade(semester.classAverage)), fontSize: '24px' }}>
                                    {semester.classAverage}
                                  </Card.Text>
                                </Card.Body>
                              </Card>
                            </Col>  
                          </Row>
                          <Row className="my-3">
                          <h6 className="sub-header">Performance Averages </h6>
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
                          </Row>
                          <Row>
                            {/* Display Average CAT 1 */}
                            <Col md={3}>
                              <Card>
                                <Card.Body>
                                  <Card.Title>Average CAT 1</Card.Title>
                                  <Card.Text style={{ color: getTextColor(calculateGrade(semester.avgCAT1)), fontSize: '24px' }}>
                                    {semester.avgCAT1}
                                  </Card.Text>
                                </Card.Body>
                              </Card>
                            </Col>                          

                            {/* Display Average CAT 2 */}
                            <Col md={3}>
                              <Card>
                                <Card.Body>
                                  <Card.Title>Average CAT 2</Card.Title>
                                  <Card.Text style={{ color: getTextColor(calculateGrade(semester.avgCAT2)), fontSize: '24px' }}>
                                    {semester.avgCAT2}
                                  </Card.Text>
                                </Card.Body>
                              </Card>
                            </Col>                          
                          </Row>
                        </React.Fragment>
                      )}
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
