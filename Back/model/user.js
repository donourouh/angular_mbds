const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  login: String,
  password: String,
  role: String
});

module.exports = mongoose.model('User', userSchema);