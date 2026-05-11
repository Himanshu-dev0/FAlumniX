const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  department: String,
  graduation_year: String,
  skills: String,
  job_title: String,
  company: String,
  location: String,
  linkedin_profile: String
});

module.exports = mongoose.model('Profile', profileSchema);