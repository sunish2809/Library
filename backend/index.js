const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

// Import Models
const SecretKey = require("./models/SecretKey");

// Import Routes
const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/students");

// Initialize the app
const app = express();

// Configure CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("MongoDB connected");

    // Check if a secret key exists, if not, create one
    const existingKey = await SecretKey.findOne();
    if (!existingKey) {
      const defaultKey = new SecretKey({ key: "OWNER_123" }); // Replace with your desired default key
      await defaultKey.save();
      console.log("Default secret key created");
    }
  })
  .catch((err) => console.log("Failed to connect to MongoDB:", err));

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
