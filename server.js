require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/roleMiddleware");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes - IMPORTANT: Order matters
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);  // Make sure this line exists

// Test routes
app.get("/api/client-only", authMiddleware, roleMiddleware("client"), (req, res) => {
  res.json({ message: "Client access granted" });
});

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: "You are authorized", user: req.user });
});

// Simple test route (not in projects router)
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

// Database Connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/freelance")
  .then(() => console.log("✅ DB Connected"))
  .catch(err => console.log("❌ DB Connection Error:", err));

// Test Route
app.get("/", (req, res) => {
  res.send("API Running");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});