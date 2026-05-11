const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;  // ← KEY LINE

// DB connection
require('./db');

// Middleware
app.use(express.json());

// Models
const Profile = require('./models/profile');
const Announcement = require('./models/announcement');

// ── Health check route ──────────────────────────
// Railway pings this to confirm app is alive
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'FAlumniX API is running ✅' });
});

// ── Profile Routes ──────────────────────────────
app.get("/api/profile", async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

// ── Announcement Routes ─────────────────────────
app.get('/api/announcements', async (req, res) => {
  try {
    const list = await Announcement.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/announcements', async (req, res) => {
  try {
    const ann = new Announcement(req.body);
    await ann.save();
    res.json({ message: "Announcement created", data: ann });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Start Server ────────────────────────────────
app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${port}`);
});