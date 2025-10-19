// routes/analytics.js
const express = require("express");
const router = express.Router();
const Passenger = require("../models/Passengers");
const Flight = require("../models/Flight");

router.get("/", async (req, res) => {
  try {
    // Seat Type Distribution (new-style bookings only)
    const seatTypeStats = await Passenger.aggregate([
      { $match: { passengers: { $exists: true, $ne: [] } } },
      { $unwind: "$passengers" },
      {
        $addFields: {
          cleanedSeatType: {
            $toLower: {
              $trim: { input: { $ifNull: ["$passengers.seatType", ""] } }
            }
          }
        }
      },
      {
        $addFields: {
          normalizedSeatType: {
            $switch: {
              branches: [
                { case: { $regexMatch: { input: "$cleanedSeatType", regex: /business/ } }, then: "Business" },
                { case: { $regexMatch: { input: "$cleanedSeatType", regex: /first/ } }, then: "First Class" }
              ],
              default: "Economy"
            }
          }
        }
      },
      {
        $group: {
          _id: "$normalizedSeatType",
          count: { $sum: 1 }
        }
      }
    ]);

    // Flight Type Distribution
    const flightTypeStats = await Flight.aggregate([
      { $addFields: {
          cleanedType: {
            $toLower: {
              $trim: { input: { $ifNull: ["$type", ""] } }
            }
          }
        }
      },
      {
        $addFields: {
          normalizedType: {
            $switch: {
              branches: [
                { case: { $eq: ["$cleanedType", "international"] }, then: "International" }
              ],
              default: "Domestic"
            }
          }
        }
      },
      {
        $group: {
          _id: "$normalizedType",
          count: { $sum: 1 }
        }
      }
    ]);

    // Booking Trends Over Time
    const bookingTrends = await Passenger.aggregate([
      { $match: { bookingDate: { $exists: true } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$bookingDate" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({ seatTypeStats, flightTypeStats, bookingTrends });
  } catch (error) {
    console.error("❌ Analytics route error:", error);
    res.status(500).json({ error: "Server error while generating analytics" });
  }
});

module.exports = router;
