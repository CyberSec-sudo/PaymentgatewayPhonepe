const { Schema, model, models } = require('mongoose');

var UserTransactionSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  api_key: {
    type: String,
    required: true,
  },
  utr: {
    type: String,
    required: true,
    unique: true,
  },
  data: {
    type: Object,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const UserTransaction = models.UserTransaction || model("UserTransaction", UserTransactionSchema);

module.exports = UserTransaction;
