const jwt = require('../../config/jwt');

function tokenVerification(req, res, next) {
    const bearer = req.headers.authorization
    const token = bearer?.slice(7)?.toString()
    if (!token) {
        return res.status(403).send({
            error: true,
            message: 'no bearer token header was present',
        })
    }
    const verification = jwt.verifyToken(token);
    if (verification === null) {
        return res
            .status(403)
            .send({ error: true, message: 'invalid bearer token supplied' })
    }
    const cookie = req.cookies.jwt;
    if (cookie !== token) {
        return res
            .status(403)
            .send({ error: true, message: 'invalid bearer token supplied' })
    }
    next()
}

module.exports = tokenVerification
