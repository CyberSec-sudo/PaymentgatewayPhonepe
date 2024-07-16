const requestCache = new Map();

const checkDuplicateRequestUpi = (req, res, next) => {
  const {apikey, utrid} = req.query

  const requestId = `${apikey}-${utrid}`;

  
  if (requestCache.has(requestId)) {
    return res.status(409).json({ error: true, message: 'Duplicate request detected' });
  }

  requestCache.set(requestId, true);
  setTimeout(() => {
    requestCache.delete(requestId);
  }, 3000);

  next();
};

module.exports = checkDuplicateRequestUpi;
