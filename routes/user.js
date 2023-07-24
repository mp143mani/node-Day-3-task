const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../config/dbConfig');

// Route to create a new mentor
router.post('/mentors', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const mentorData = req.body; // Assuming req.body contains mentor details
    const data = await db.collection('mentors').insertOne(mentorData);

    res.status(200).send({
      message: "Mentor Data Saved successfully",
      data
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

// Route to create a new student
router.post('/students', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const studentData = req.body; // Assuming req.body contains student details
    const data = await db.collection('students').insertOne(studentData);

    res.status(200).send({
      message: "Student Data Saved successfully",
      data
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

// Route to assign a student to a mentor
router.post('/assign/:mentorId/:studentId', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const mentorId = req.params.mentorId;
    const studentId = req.params.studentId;

    // Assuming you have separate collections for mentors and students
    // Retrieve the mentor and student from their respective collections
    const mentor = await db.collection('mentors').findOne({ _id: new mongodb.ObjectId(mentorId) });
    const student = await db.collection('students').findOne({ _id: new mongodb.ObjectId(studentId) });

    if (!mentor || !student) {
      res.status(404).send({
        message: "Mentor or Student not found",
      });
      return;
    }

    // Assign the student to the mentor
    mentor.students = mentor.students || [];
    mentor.students.push(student);

    // Update the mentor with the assigned student
    await db.collection('mentors').updateOne({ _id: new mongodb.ObjectId(mentorId) }, { $set: mentor });

    res.status(200).send({
      message: "Student assigned to Mentor successfully",
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

// Route to update the mentor of a student
router.put('/student/:studentId/assign-mentor/:mentorId', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const mentorId = req.params.mentorId;
    const studentId = req.params.studentId;

    // Assuming you have separate collections for mentors and students
    // Retrieve the mentor and student from their respective collections
    const mentor = await db.collection('mentors').findOne({ _id: new mongodb.ObjectId(mentorId) });
    const student = await db.collection('students').findOne({ _id: new mongodb.ObjectId(studentId) });

    if (!mentor || !student) {
      res.status(404).send({
        message: "Mentor or Student not found",
      });
      return;
    }

    // Update the student with the new mentor ID
    student.mentor = new mongodb.ObjectId(mentorId);

    // Update the student with the new mentor assignment
    await db.collection('students').updateOne({ _id: new mongodb.ObjectId(studentId) }, { $set: student });

    res.status(200).send({
      message: "Mentor assigned to Student successfully",
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

// Route to get all students assigned to a mentor
router.get('/mentor/:mentorId/students', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const mentorId = req.params.mentorId;

    // Assuming you have separate collections for mentors and students
    // Retrieve the mentor from the mentors collection
    const mentor = await db.collection('mentors').findOne({ _id: new mongodb.ObjectId(mentorId) });

    if (!mentor) {
      res.status(404).send({
        message: "Mentor not found",
      });
      return;
    }

    // Retrieve all students assigned to this mentor
    const students = await db.collection('students').find({ mentor: new mongodb.ObjectId(mentorId) }).toArray();

    res.status(200).send({
      message: "Students for Mentor fetched successfully",
      students
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

// Route to get the previous mentor of a student
router.get('/student/:studentId/previous-mentor', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const studentId = req.params.studentId;

    // Assuming you have a collection for students
    // Retrieve the student from the students collection
    const student = await db.collection('students').findOne({ _id: new mongodb.ObjectId(studentId) });

    if (!student) {
      res.status(404).send({
        message: "Student not found",
      });
      return;
    }

    // Check if the student has a previous mentor assigned
    if (!student.previousMentor) {
      res.status(200).send({
        message: "Student has no previous mentor assigned",
        previousMentor: null
      });
      return;
    }

    // Retrieve the previous mentor details from the mentors collection
    const previousMentor = await db.collection('mentors').findOne({ _id: student.previousMentor });

    res.status(200).send({
      message: "Previous Mentor for Student fetched successfully",
      previousMentor
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
