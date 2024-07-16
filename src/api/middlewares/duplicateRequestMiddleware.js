const requestCache = new Map();
const jwt = require('../../config/jwt');

const checkDuplicateRequest = (req, res, next) => {
  const numberId = req.body;
    const bearer = req.headers.authorization
    const token = bearer?.slice(7)?.toString()
    const authid = jwt.verifyToken(token).authid;

  const requestId = `${numberId}-${authid}`;

  if (requestCache.has(requestId)) {
    return res.status(409).json({ error: true, message: 'Duplicate request detected' });
  }

  requestCache.set(requestId, true);
  setTimeout(() => {
    requestCache.delete(requestId);
  }, 500);

  next();
};

module.exports = checkDuplicateRequest;
