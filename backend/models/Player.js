const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  r6_id: String,
  uplay_name: String,
  apex_id: String,
  origin_name: String,
  name: String,
  email: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Player', PlayerSchema);
