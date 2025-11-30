const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

UserSchema.methods.comparePassword = function(plain) {
  return bcrypt.compareSync(plain, this.password);
};

module.exports = mongoose.model('User', UserSchema);
