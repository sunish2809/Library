const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const verifySecretKey = require("../middleware/auth");

// POST route to add a student
router.post("/", verifySecretKey, async (req, res) => {
  let { name, seatNumber, mobileNumber, paymentHistory } = req.body;

  // Validation
  if (!name || !seatNumber || !mobileNumber || !paymentHistory) {
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
      paymentHistory,
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

  if (amountPaid === undefined) {
    return res.status(400).json({ message: "Please provide amountPaid" });
  }

  try {
    // Find student by seat number and update payment history
    const student = await Student.findOneAndUpdate(
      { seatNumber: parseInt(seatNumber) },
      { $push: { paymentHistory: { amountPaid } } },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Payment updated successfully", student });
  } catch (error) {
    res.status(500).json({ message: "Error updating payment", error });
  }
});

// GET route to retrieve students by name
router.get("/name/:name", verifySecretKey, async (req, res) => {
  const { name } = req.params;

  try {
    const trimmedName = name.trim().replace(/\s+/g, " ");

    const students = await Student.find({
      name: { $regex: new RegExp(trimmedName, "i") },
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
    const students = await Student.find({}, { name: 1, seatNumber: 1, _id: 0 });

    if (!students.length) {
      return res.status(404).json({ message: "No students found" });
    }

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error });
  }
});

module.exports = router;
