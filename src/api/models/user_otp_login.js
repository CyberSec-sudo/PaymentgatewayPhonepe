const { Schema, model, models } = require('mongoose');

var UserLoginSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  number: {
    type: String,
    required: true,
  },
  fingerprint: {
    type: String,
    required: true,
  },
  deviceFingerprint: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const UserLogin = models.UserLogin || model("UserLogin", UserLoginSchema);

module.exports = UserLogin;
