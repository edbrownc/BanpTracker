const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  p_id: String,
  name: String,
  email: String,
  uplay_name: String,
  avatar_url: String
});

module.exports = mongoose.model('Player', PlayerSchema);
