const mongoose = require('mongoose');
require('dotenv').config();

const mongoURL = process.env.MONGO_URL;

if (!mongoURL) {
  console.error("❌ MONGO_URL not found");
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
  console.log("⚠️ MongoDB disconnected");
});

module.exports = db;