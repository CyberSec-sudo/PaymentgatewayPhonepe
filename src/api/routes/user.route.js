const express = require('express');
const router = express.Router();
const tokenCheck = require('../middlewares/tokenCheck');
const tokenVerification = require('../middlewares/tokenVerification');
const controller = require('../controllers/user.controller')
const checkDuplicateRequest = require('../middlewares/duplicateRequestMiddleware');
const checkUserStatus = require('../middlewares/checkUserStatus');







router.route('/register').post(controller.register);
router.route('/login').post(controller.login);
router.route('/checkNumber').post(tokenCheck, tokenVerification, checkDuplicateRequest, checkUserStatus, controller.checkNumber);
router.route('/utrChecker').post(tokenCheck, tokenVerification, checkDuplicateRequest, checkUserStatus, controller.utrChecker);
router.route('/autoWithdrawal').post(tokenCheck, tokenVerification, checkDuplicateRequest, checkUserStatus, controller.autoWithdrawal);
router.route('/getAutoWithdrawal').post(tokenCheck, tokenVerification, checkDuplicateRequest, checkUserStatus, controller.getAutoWithdrawal);
router.route('/getWithdrawalDetails').post(tokenCheck, tokenVerification, checkDuplicateRequest, checkUserStatus, controller.getWithdrawalDetails);
router.route('/getTotalBalance').post(tokenCheck, tokenVerification, checkDuplicateRequest, checkUserStatus, controller.getTotalBalance);
router.route('/withdrawalAmount').post(tokenCheck, tokenVerification, checkDuplicateRequest, checkUserStatus, controller.withdrawalAmount);

router.route('/generateOtp').post(tokenCheck, tokenVerification, checkDuplicateRequest, checkUserStatus, controller.generateOtp);
router.route('/verifyOtp').post(tokenCheck, tokenVerification, checkDuplicateRequest, checkUserStatus, controller.verifyOtp);
router.route('/deleteNum').post(tokenCheck, tokenVerification, checkDuplicateRequest, checkUserStatus, controller.deleteNum);
router.route('/fetchTransaction').post(tokenCheck, tokenVerification, checkDuplicateRequest, checkUserStatus, controller.fetchTransaction);

module.exports = router;
