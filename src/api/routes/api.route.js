const express = require('express');
const router = express.Router();
const controller = require('../controllers/api.controller')
const checkDuplicateRequestUpi = require('../middlewares/duplicateRequestMiddlewareUpi');
const checkUserStatusApi = require('../middlewares/checkUserStatusApi');





router.route('/').get(checkUserStatusApi, checkDuplicateRequestUpi, controller.addtransaction)

//router.route('/add').get(checkUserStatusApi, checkDuplicateRequestUpi, controller.addtransaction)

module.exports = router;
