const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

// Initialize the app
const app = express();
// app.use(cors()); // This allows all origins by default
// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL || "http://localhost:5173", // Replace with your frontend URL
//   })
// );
app.use(cors({
  origin: 'https://library-frontend-six-delta.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(bodyParser.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Failed to connect to MongoDB:", err));

// Student Schema
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  seatNumber: { type: Number, required: true, unique: true },
  mobileNumber: { type: String, required: true /*unique: true*/ },
  paymentHistory: [
    {
      amountPaid: { type: Number, required: true },
      paymentDate: { type: Date, default: Date.now },
    },
  ],
});

// Student Model
const Student = mongoose.model("Student", studentSchema);

// POST route to add a student
app.post("/api/students", async (req, res) => {
  const { name, seatNumber, mobileNumber, paymentHistory } = req.body;

  // Validation
  if (!name || !seatNumber || !mobileNumber || !paymentHistory) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  name = name.trim().replace(/\s+/g, " "); // Trim and replace multiple spaces with a single space
  seatNumber = seatNumber.trim().replace(/\s+/g, ""); // Trim seat number
  mobileNumber = mobileNumber.trim().replace(/\s+/g, ""); // Trim mobile number

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
      res.status(400).json({ message: "Mobile number must be unique" });
    } else {
      res.status(500).json({ message: "Error adding student", error });
    }
  }
});

// PUT route to update payment history for a student by seat number
app.put("/api/students/payment/seat/:seatNumber", async (req, res) => {
  const { seatNumber } = req.params;
  const { amountPaid } = req.body;

  if (amountPaid === undefined) {
    return res.status(400).json({ message: "Please provide amountPaid" });
  }

  try {
    // Find student by seat number and update payment history
    const student = await Student.findOneAndUpdate(
      { seatNumber: parseInt(seatNumber.trim()) }, // Trim spaces and convert to number
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
app.get("/api/students/name/:name", async (req, res) => {
  const { name } = req.params;

  try {
    const trimmedName = name.trim().replace(/\s+/g, " "); // Trim and replace multiple spaces with a single space

    const students = await Student.find({
      name: { $regex: new RegExp(trimmedName, "i") }, // Case-insensitive regex search
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
app.delete("/api/students/:name/:seatNumber", async (req, res) => {
  const { name, seatNumber } = req.params; // Fetch name and seatNumber from URL parameters

  // Validation to check if both fields are provided
  if (!name || !seatNumber) {
    return res
      .status(400)
      .json({ message: "Please provide both name and seatNumber" });
  }

  try {
    // Find and delete the student by name and seatNumber
    const deletedStudent = await Student.findOneAndDelete({
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") }, // Case-insensitive and trimmed name match
      seatNumber: parseInt(seatNumber.trim()), // Trim and convert to number
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
app.get("/api/students/all", async (req, res) => {
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

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
