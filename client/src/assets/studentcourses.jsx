import React, { useState } from "react";
import { Card } from "react-bootstrap";

const StudentCourses = ({ selectedCourses }) => {
  return (
    <div>
      <h2>Your Selected Courses</h2>
      {selectedCourses.length === 0 ? (
        <p>No courses selected.</p>
      ) : (
        selectedCourses.map((course) => (
          <Card key={course.id}>
            <Card.Body>
              <Card.Title>{course.title}</Card.Title>
              <Card.Text>{course.description}</Card.Text>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
};

export default StudentCourses;
