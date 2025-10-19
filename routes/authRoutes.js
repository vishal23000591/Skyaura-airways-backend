const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Customer Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existing = await Customer.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    // Hash the password
    const hashed = await bcrypt.hash(password, 10);

    // Create and save customer
    const customer = new Customer({ name, email, password: hashed });
    await customer.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Customer Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find customer by email
    const customer = await Customer.findOne({ email });
    if (!customer) return res.status(400).json({ message: "Invalid credentials" });

    // Compare password
    const valid = await bcrypt.compare(password, customer.password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    // Create JWT token
    const token = jwt.sign({ userId: customer._id }, process.env.JWT_SECRET, {
      expiresIn: "1d", // token expiry optional
    });

    res.json({ token, user: { id: customer._id, name: customer.name, email: customer.email } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
