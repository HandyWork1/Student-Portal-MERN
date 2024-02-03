import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from "axios";

const AddCourseModal = ({ show, onHide }) => {
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddCourse = async () => {
    try {
      // Make a POST request to the API endpoint
      await axios.post('http://localhost:7000/api/admin/add-course', {
        courseCode,
        courseName,
        courseDescription,
      });
       // Check if the response contains an error
      if (response.data.error === 'CourseAlreadyExists') {
        // Display error message in the modal
        setErrorMessage('Course with this code already exists.');
        // Clear error message after a timeout
        setTimeout(() => {
            setErrorMessage('');
          }, 5000);
      } else{
          // Display success message
          setSuccessMessage('Course added successfully!');
          // Close the modal after successful addition
          onHide();   
          // Clear success message after a timeout
          setTimeout(() => {
            setSuccessMessage('');
          }, 5000);
      }

    } catch (error) {
      console.error('Error adding course:', error.message);
      setErrorMessage('An error occurred while adding the course.');
      // Clear error message after a timeout
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add Course</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="courseCode">
            <Form.Label style={{ fontWeight: 'bold' }}>Course Code</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter course code"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="courseName">
            <Form.Label style={{ fontWeight: 'bold' }}>Course Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter course name"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="courseDescription">
            <Form.Label style={{ fontWeight: 'bold' }}>Course Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter course description"
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleAddCourse}>
          Add Course
        </Button>
      </Modal.Footer>
      {successMessage && (
        <Alert variant="success" className="position-fixed top-25 start-50 translate-middle-x">
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert variant="danger" className="position-fixed top-25 start-50 translate-middle-x">
          {errorMessage}
        </Alert>
      )}
    </Modal>
  );
};

export default AddCourseModal;
