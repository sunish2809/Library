const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const verifySecretKey = require("../middleware/auth");

// POST route to add a student
router.post("/", verifySecretKey, async (req, res) => {
  let { name, seatNumber, mobileNumber,aadharNumber, paymentHistory,dueAmount} = req.body;

  // Validation
  if (!name || !seatNumber || !mobileNumber ||!aadharNumber|| !paymentHistory||!dueAmount) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  name = name.trim().replace(/\s+/g, " ");
  seatNumber = parseInt(seatNumber);
  mobileNumber = mobileNumber.trim().replace(/\s+/g, "");

  try {
    // Create and save the student in the database
    const newStudent = new Student({
      name,
      seatNumber,
      mobileNumber,
      aadharNumber,
      paymentHistory,
      dueAmount,
    });
    await newStudent.save();
    res
      .status(201)
      .json({ message: "Student added successfully", student: newStudent });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Seat number must be unique" });
    } else {
      res.status(500).json({ message: "Error adding student", error });
    }
  }
});

// PUT route to update payment history for a student by seat number
router.put("/payment/seat/:seatNumber", verifySecretKey, async (req, res) => {
  const { seatNumber } = req.params;
  const { amountPaid } = req.body;
  const {dueAmount} = req.body;

  if (amountPaid === undefined || dueAmount===undefined) {
    return res.status(400).json({ message: "Please provide amountPaid and dueAmount" });
  }

  try {
    // Find the student by seat number
    const student = await Student.findOne({ seatNumber: parseInt(seatNumber) });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Update the student's payment history and due amount
    student.paymentHistory.push({ amountPaid });
    student.dueAmount = dueAmount;

    // Save the updated student document
    await student.save();

    res.json({ message: "Payment and due amount updated successfully", student });
  } catch (error) {
    res.status(500).json({ message: "Error updating payment and due amount", error });
  }
});

// GET route to retrieve students by name
router.get("/name/:seatNumber", verifySecretKey, async (req, res) => {
  const { seatNumber } = req.params;

  try {
    //const trimmedseatNumber = seatNumber.trim().replace(/\s+/g, " ");

    const students = await Student.find({
      seatNumber: parseInt(seatNumber),
    });

    if (!students.length) {
      return res
        .status(404)
        .json({ message: "No students found with that name" });
    }

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error });
  }
});

// DELETE route to remove a student by name and seatNumber
router.delete("/:name/:seatNumber", verifySecretKey, async (req, res) => {
  const { name, seatNumber } = req.params;

  // Validation to check if both fields are provided
  if (!name || !seatNumber) {
    return res
      .status(400)
      .json({ message: "Please provide both name and seatNumber" });
  }

  try {
    // Find and delete the student by name and seatNumber
    const deletedStudent = await Student.findOneAndDelete({
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
      seatNumber: parseInt(seatNumber),
    });

    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({
      message: "Student deleted successfully",
      student: deletedStudent,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting student", error });
  }
});

// GET route to retrieve all students' names and seat numbers
router.get("/all", verifySecretKey, async (req, res) => {
  try {
    // Fetch all students and project only the name and seatNumber fields
    //const students = await Student.find({}, { name: 1, seatNumber: 1, _id: 0 });
    const students = await Student.find({}, { name: 1, seatNumber: 1, paymentHistory: 1, _id: 0 });


    if (!students.length) {
      return res.status(404).json({ message: "No students found" });
    }

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error });
  }
});

module.exports = router;
