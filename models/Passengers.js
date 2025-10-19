const mongoose = require("mongoose");

const passengerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  flightId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flight",
    required: true,
  },
  passengers: [
    {
      name: { type: String, required: true },
      dob: { type: String, required: true },
      gender: { type: String, required: true },
      idNumber: { type: String, required: true },
      seatType: {
      type: String,
      enum: ["Economy", "Business", "First Class"], // you can add more types if needed
      required: true,
    },
    },
  ],
  

  payment: {
    method: { type: String, required: true },
    amount: { type: Number, required: true },
    details: {
      upiId: { type: String },
    },
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Passenger", passengerSchema);
