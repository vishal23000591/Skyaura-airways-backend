const express = require("express");
const router = express.Router();
const Passenger = require("../models/Passengers");

// POST /api/passengers - Save booking
router.post("/", async (req, res) => {
  console.log("📥 Incoming /api/passengers POST:", req.body);

  try {
    const { email, flightId, passengers, payment, bookingDate, seatType } = req.body;


    // Validations
    if (!email) return res.status(400).json({ error: "email is required" });
    if (!flightId) return res.status(400).json({ error: "flightId is required" });
    if (!Array.isArray(passengers) || passengers.length === 0)
      return res.status(400).json({ error: "passengers must be a non-empty array" });
    if (!payment || !payment.method || !payment.amount)
      return res.status(400).json({ error: "payment.method and payment.amount are required" });

    // Save new booking document
    const newBooking = new Passenger({
      email,
      flightId,
      seatType,
      passengers,
      payment,
      bookingDate: bookingDate || new Date(),
    });

    const saved = await newBooking.save();
    console.log("✅ Booking saved with ID:", saved._id);

    res.status(200).json({
      success: true,
      message: "Booking saved successfully",
      passengerData: saved,
    });
  } catch (err) {
    console.error("❌ Server error in /api/passengers:", err);
    res.status(500).json({
      error: "Internal Server Error",
      details: err.message,
    });
  }
});

module.exports = router;
