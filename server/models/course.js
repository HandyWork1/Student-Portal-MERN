const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
});

const Course = mongoose.model("Course", courseSchema);

// Function to insert sample courses into the database only once
const insertSampleCourses = async () => {
  try {
    // Check if there are existing documents in the Course collection
    const existingCourses = await Course.find();
    
    // If no existing documents, insert sample courses
    if (existingCourses.length === 0) {
      // Sample courses
      const sampleCourses = [
        { code: 'IST1020', name: 'Introduction to Computer Science', description: 'Fundamental concepts of computer science.' },
        { code: 'MTH201', name: 'Calculus I', description: 'Fundamental principles of calculus.' },
        { code: 'IST2045', name: 'Networking', description: 'Introduction to Network' },
        { code: 'APT1050', name: 'Databases', description: 'Intruduction to Databases.' },
        { code: 'GRM2000', name: 'Research', description: 'Introduction to Research.' },
        { code: 'BUS2010', name: 'Interprenuership', description: 'Introduction to Interprenuership.' },
        { code: 'PHY1010', name: 'Physochology', description: 'Introduction to Physochology.' },
        { code: 'FRE1000', name: 'French', description: 'French 1.' },
        { code: 'FRE2000', name: 'Frech', description: 'French 2.' },  
        // Add more sample courses as needed
      ];

      // Insert sample courses into the database
      await Course.insertMany(sampleCourses);
      console.log('Sample courses inserted successfully.');
    } else {
      console.log('Sample courses already exist in the database. Skipping insertion.');
    }
  } catch (error) {
    console.error('Error inserting sample courses:', error.message);
  }
};

// Call the function to insert sample courses
insertSampleCourses();

module.exports = Course;
