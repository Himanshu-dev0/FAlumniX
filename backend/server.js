const express = require('express');
require('dotenv').config();
const app = express();

// ✅ Railway uses dynamic PORT - never hardcode 3000
const port = process.env.PORT || 3000;

// DB connection
require('./db');

// ✅ Middleware
app.use(express.json());

// ✅ Models
const Profile = require('./models/profile');
const Announcement = require('./models/announcement');

// ====================== PROFILE ROUTES ======================

// GET all profiles
app.get("/api/profile", async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE profile
app.post('/api/profile', async (req, res) => {
  try {
    const profile = new Profile(req.body);
    await profile.save();
    res.status(200).json({
      message: "Profile saved successfully",
      data: profile
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ====================== ANNOUNCEMENT ROUTES ======================

// GET all announcements
app.get('/api/announcements', async (req, res) => {
  try {
    const list = await Announcement.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE announcement
app.post('/api/announcements', async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const ann = new Announcement(req.body);
    await ann.save();
    res.json({
      message: "Announcement created",
      data: ann
    });
  } catch (error) {
    console.log("ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ====================== SERVER ======================

app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${port}`);
});