import React from "react";

const ScoresDisplay = ({ scores }) => {
  // Check if scores is undefined or an empty array
  if (!scores || scores.length === 0) {
    return <p>No scores available</p>;
  }

  return (
    <div>
      <h2>Scores</h2>
      <table>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Assignment 1</th>
            <th>Assignment 2</th>
            <th>CAT 1</th>
            <th>CAT 2</th>
            <th>Exam</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score) => (
            <tr key={score._id}>
              <td>{score.studentName}</td>
              <td>{score.assignment1}</td>
              <td>{score.assignment2}</td>
              <td>{score.cat1}</td>
              <td>{score.cat2}</td>
              <td>{score.exam}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScoresDisplay;
