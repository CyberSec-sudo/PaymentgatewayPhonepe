const jwt = require('../../config/jwt');

const tokenCheck = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ error: false, error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verifyToken(token);

    req.token = decoded;

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: false, error: 'Unauthorized' });
  }
};

module.exports = tokenCheck;
