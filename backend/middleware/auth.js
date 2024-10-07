const SecretKey = require("../models/SecretKey");

const verifySecretKey = async (req, res, next) => {
  const secretKey = req.headers["x-secret-key"];

  if (!secretKey) {
    return res.status(401).json({ message: "Secret key is missing" });
  }

  try {
    const storedKey = await SecretKey.findOne();
    if (!storedKey) {
      return res.status(500).json({ message: "Secret key is not set up" });
    }

    if (secretKey === storedKey.key) {
      next();
    } else {
      return res.status(401).json({ message: "Invalid secret key" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error verifying secret key", error });
  }
};

module.exports = verifySecretKey;
