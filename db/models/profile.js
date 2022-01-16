const mongoose = require('mongoose')
const db = require('../pool').app()

const profile = new mongoose.Schema({
  publicId: String,
  linkedin: mongoose.Schema.Types.Mixed,
  google: mongoose.Schema.Types.Mixed,
  twitter: mongoose.Schema.Types.Mixed,
  faceInformation: mongoose.Schema.Types.Mixed,
  expire_at: { type: Date, default: Date.now, expires: 600 }
});

module.exports = db.model('profiles', profile)