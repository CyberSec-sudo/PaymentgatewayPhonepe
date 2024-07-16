const express = require('express')
const router = express.Router()
const ejsRoutes = require('./ejs.route')
const userRoutes = require('./user.route');
const apiRoutes = require('./api.route');

router.use('/', ejsRoutes);
router.use('/user', userRoutes);
router.use('/transaction', apiRoutes);


module.exports = router
