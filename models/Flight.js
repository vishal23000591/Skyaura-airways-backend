const mongoose = require("mongoose");

const flightSchema = new mongoose.Schema({
  flightNumber: String,
  departure: String,
  arrival: String,
  departureTime: String,
  arrivalTime: String,
  seatsAvailable: Number,
  price: Number,
  type: {
    type: String,
    enum: ["Domestic", "International"],
    required: true
  },
  source: String,
  destination: String,
  date: String,
  seat: String
});

module.exports = mongoose.model("Flight", flightSchema); // 👈 Collection name auto becomes "flights"
