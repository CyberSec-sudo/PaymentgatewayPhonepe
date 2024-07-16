const { Schema, model, models } = require('mongoose');

var UserApiSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  token: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  api_key: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  merchantid: {
    type: String,
    required: true,
  },
  storeId: {
    type: String,
    required: true,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const UserApi = models.UserApi || model("UserApi", UserApiSchema);

module.exports = UserApi;
