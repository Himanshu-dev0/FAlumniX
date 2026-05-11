const mongoose = require('mongoose');
require('dotenv').config();

// Use environment variable - never hardcode credentials
const mongoURL = process.env.MONGO_URL;

if (!mongoURL) {
  console.error("❌ MONGO_URL not found in environment variables");
  process.exit(1);
}

mongoose.connect(mongoURL)

const db = mongoose.connection;

db.on('connected', () => {
  console.log("✅ Connected to MongoDB server");
});

db.on('error', (err) => {
  console.log("❌ MongoDB connection error:", err);
});

db.on('disconnected', () => {
  console.log("⚠️ MongoDB server disconnected");
});

module.exports = db;