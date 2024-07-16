const { Schema, model, models } = require('mongoose');

var UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  amount: {
    type: String,
    default: "0",
  },
  auto_withdrawal: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const User = models.User || model("User", UserSchema);

module.exports = User;
