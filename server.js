// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",                // local dev
    "https://skyaura-airways-e0iy.onrender.com"      // your Vercel frontend
  ],
  credentials: true
}));
app.use(express.json());


// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing in .env");
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Routes
try {
  const adminAuthRoutes = require("./routes/auth");
  const customerAuthRoutes = require("./routes/authRoutes");
  const flightRoutes = require("./routes/flights");
  const passengerRoutes = require("./routes/passengers");
  const bookingsRoutes = require("./routes/bookings");
  const analyticsRoutes = require("./routes/analytics");
app.use("/api/analytics", analyticsRoutes);

  app.use("/api", bookingsRoutes);

  app.use("/api/admin", adminAuthRoutes);
  app.use("/api/customer", customerAuthRoutes);
  app.use("/api/flights", flightRoutes);
  app.use("/api/passengers", passengerRoutes);
} catch (error) {
  console.error("❌ Error loading routes:", error);
  process.exit(1);
}
