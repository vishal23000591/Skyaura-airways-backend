const express = require("express");
const router = express.Router();
const Passenger = require("../models/Passengers");

router.get("/bookings/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const bookings = await Passenger.find({ email })
      .populate({
        path: "flightId",
        select: "flightNumber departure arrival departureTime arrivalTime", // choose fields to send
      })
      .exec();

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
