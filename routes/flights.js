// routes/flights.js
const express = require('express');
const router = express.Router();
const Flight = require('../models/Flight');

// Add flight
router.post('/', async (req, res) => {
  console.log("Incoming Flight Data:", req.body); // 👈 log here

  try {
    const flight = new Flight(req.body);
    await flight.save();
    res.status(201).json({ message: 'Flight added successfully' });
  } catch (error) {
    console.error("Error saving flight:", error); // 👈 log error
    res.status(500).json({ error: 'Failed to add flight' });
  }
});


// Get all flights
router.get('/', async (req, res) => {
  try {
    const flights = await Flight.find();
    res.json(flights);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
