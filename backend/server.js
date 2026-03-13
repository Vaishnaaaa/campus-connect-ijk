// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const connectDB = require("./config/db");
const { initFirebase } = require("./config/firebase");
const errorHandler = require("./middleware/errorHandler");

// ── Route imports ─────────────────────────────────────────────────────────────
const authRoutes = require("./routes/auth");
const hostelRoutes = require("./routes/hostels");
const bookingRoutes = require("./routes/bookings");
const dealRoutes = require("./routes/deals");
const eventRoutes = require("./routes/events");

// ── Init ──────────────────────────────────────────────────────────────────────
connectDB();
initFirebase();

const app = express();

// ── Global Middleware ─────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) =>
  res.json({ success: true, message: "CampusConnect API running 🚀", env: process.env.NODE_ENV })
);

// ── API Routes ────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/hostels", hostelRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/deals", dealRoutes);
app.use("/api/events", eventRoutes);

// ── 404 catch ─────────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ success: false, message: "Route not found" }));

// ── Error handler ─────────────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀  CampusConnect API  →  http://localhost:${PORT}`);
  console.log(`📋  Environment       →  ${process.env.NODE_ENV}`);
});
