const jwt = require('jsonwebtoken');
const config = require('../config/config')
function generateToken(payload) {
  const token = jwt.sign(payload, config.jwtSecret, {
    expiresIn: '24h'
  });
  return token;
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    return decoded;
  } catch (error) {
    return null;
  }
}

module.exports = {
  generateToken,
  verifyToken
};
