import React, { useState } from 'react';
import axios from "axios";
import { Modal, Button, Form } from 'react-bootstrap';

const AddScoresModal = ({ show, handleClose, fetchStudents, student }) => {
  const [formData, setFormData] = useState({
    assignment1: 0,
    assignment2: 0,
    cat1: 0,
    cat2: 0,
    exam: 0,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("this is the form data ", formData);  
    // Check if any of the values are still zero
    if (
      formData.assignment1 === 0 ||
      formData.assignment2 === 0 ||
      formData.cat1 === 0 ||
      formData.cat2 === 0 ||
      formData.exam === 0
    ) {
      console.log('Please fill in all score fields.');
      return;
    }
    handleAddScores(student, formData);
    handleClose();
  };

  // Add scores 
  const handleAddScores = async (student) => {
    try {
      // Check if scores already exist for the student
      const existingScore = await axios.get(`http://localhost:7000/api/scores/${student._id}`);
      console.log("This is the existing score ", existingScore.length);
  
      if (existingScore && existingScore.length > 0) {
        console.log('Scores already exist for this student. Editing is not allowed.');
        return;
      }
  
      // Perform input validation
      if (
        formData.assignment1 > 10 ||
        formData.assignment2 > 10 ||
        formData.cat1 > 20 ||
        formData.cat2 > 20 ||
        formData.exam > 40
      ) {
        console.log('Invalid score values. Please check and try again.');
        return;
      }
  
      // Assuming you have the studentCourseId in your student object
      const studentCourseId = student._id;
  
      // Perform the addition of scores
      const response = await axios.post(`http://localhost:7000/api/scores`, {
        studentName: student.user._id,
        studentCourse: studentCourseId,
        assignment1: formData.assignment1,
        assignment2: formData.assignment2,
        cat1: formData.cat1,
        cat2: formData.cat2,
        exam: formData.exam,
      });
      // Refresh table records by fetching students again
      fetchStudents();
      console.log('Scores added successfully:', response.data);
  
      // You might want to update the UI or state after successful addition
    } catch (error) {
      console.error('Error adding scores:', error.message);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
      <Modal.Title>
        {student && student.user && student.user.name ? `Add Scores for ${student.user.name}` : 'Add Scores'}
      </Modal.Title>

      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="assignment1">
            <Form.Label>Assignment 1</Form.Label>
            <Form.Control
              type="number"
              name="assignment1"
              value={formData.assignment1}
              onChange={handleChange}
              max="10"
            />
          </Form.Group>

          <Form.Group controlId="assignment2">
            <Form.Label>Assignment 2</Form.Label>
            <Form.Control
              type="number"
              name="assignment2"
              value={formData.assignment2}
              onChange={handleChange}
              max="10"
            />
          </Form.Group>

          <Form.Group controlId="cat1">
            <Form.Label>CAT 1</Form.Label>
            <Form.Control
              type="number"
              name="cat1"
              value={formData.cat1}
              onChange={handleChange}
              max="20"
            />
          </Form.Group>

          <Form.Group controlId="cat2">
            <Form.Label>CAT 2</Form.Label>
            <Form.Control
              type="number"
              name="cat2"
              value={formData.cat2}
              onChange={handleChange}
              max="20"
            />
          </Form.Group>

          <Form.Group controlId="exam">
            <Form.Label>Exam</Form.Label>
            <Form.Control
              type="number"
              name="exam"
              value={formData.exam}
              onChange={handleChange}
              max="40"
            />
          </Form.Group>

          <Button className='mt-3' variant="primary" type="submit">
            Add Scores
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddScoresModal;
