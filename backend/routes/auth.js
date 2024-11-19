const express = require("express");
const router = express.Router();
const SecretKey = require("../models/SecretKey");

// @route   POST /api/auth/verify
// @desc    Verify the secret key for authentication
// @access  Public
router.post("/verify", async (req, res) => {
  const { secretKey } = req.body;

  if (!secretKey) {
    return res.status(400).json({ message: "Secret key is required" });
  }

  try {
    const storedKey = await SecretKey.findOne();

    if (!storedKey) {
      return res.status(500).json({ message: "Secret key is not set up" });
    }

    if (secretKey === storedKey.key) {
      return res.json({ message: "Authentication successful" });
    } else {
      return res.status(401).json({ message: "Invalid secret key" });
    }
    
  } catch (error) {
    res.status(500).json({ message: "Error verifying secret key", error });
  }
});

// @route   POST /api/auth/change-key
// @desc    Change the secret key
// @access  Protected (Requires current secret key)
const verifySecretKey = require("../middleware/auth");

router.post("/change-key", verifySecretKey, async (req, res) => {
  const { currentKey, newKey } = req.body;

  if (!currentKey || !newKey) {
    return res
      .status(400)
      .json({ message: "Current and new secret keys are required" });
  }

  try {
    const storedKey = await SecretKey.findOne();
    if (!storedKey) {
      return res.status(500).json({ message: "Secret key is not set up" });
    }

    if (currentKey !== storedKey.key) {
      return res
        .status(401)
        .json({ message: "Current secret key is incorrect" });
    }
    


    storedKey.key = newKey;

    await storedKey.save();

    res.json({ message: "Secret key updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating secret key", error });
  }
});

module.exports = router;
