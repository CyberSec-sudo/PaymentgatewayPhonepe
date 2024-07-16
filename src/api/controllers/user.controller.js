const { UserHandler } = require("../class/UserHandler")

exports.register = async (req, res) => {
    const userHandler = new UserHandler(req.headers.authorization);
    const data = await userHandler.register(req.body, res);
    return res.status(200).json({ error: false, data: data })
}

exports.login = async (req, res) => {
    const userHandler = new UserHandler(req.headers.authorization);
    const data = await userHandler.login(req.body, res);
    return res.status(200).json({ error: false, data: data })
}

exports.checkNumber = async (req, res) => {
    const userHandler = new UserHandler(req.headers.authorization);
    const data = await userHandler.checkNumber();
    return res.status(200).json({ error: false, data: data })
}


exports.generateOtp = async (req, res) => {
    const userHandler = new UserHandler(req.headers.authorization);
    const data = await userHandler.generateOtp(req.body);
    return res.status(200).json({ error: false, data: data })
}

exports.verifyOtp = async (req, res) => {
    const userHandler = new UserHandler(req.headers.authorization);
    const data = await userHandler.verifyOtp(req.body);
    return res.status(200).json({ error: false, data: data })
}

exports.deleteNum = async (req, res) => {
    const userHandler = new UserHandler(req.headers.authorization);
    const data = await userHandler.deleteNum();
    return res.status(200).json({ error: false, data: data })
}

exports.fetchTransaction = async (req, res) => {
    const userHandler = new UserHandler(req.headers.authorization);
    const data = await userHandler.fetchTransaction(req.body);
    return res.status(200).json({ error: false, data: data })
}
exports.utrChecker = async (req, res) => {
    const userHandler = new UserHandler(req.headers.authorization);
    const data = await userHandler.utrChecker(req.body);
    return res.status(200).json({ error: false, data: data })
}
exports.autoWithdrawal = async (req, res) => {
    const userHandler = new UserHandler(req.headers.authorization);
    const data = await userHandler.autoWithdrawal(req.body);
    return res.status(200).json({ error: false, data: data })
}

exports.getAutoWithdrawal = async (req, res) => {
    const userHandler = new UserHandler(req.headers.authorization);
    const data = await userHandler.getAutoWithdrawal();
    return res.status(200).json({ error: false, data: data })
}

exports.getWithdrawalDetails = async (req, res) => {
    const userHandler = new UserHandler(req.headers.authorization);
    const data = await userHandler.getWithdrawalDetails(req.body);
    return res.status(200).json({ error: false, data: data })
}

exports.getTotalBalance = async (req, res) => {
    const userHandler = new UserHandler(req.headers.authorization);
    const data = await userHandler.getTotalBalance();
    return res.status(200).json({ error: false, data: data })
}

exports.withdrawalAmount = async (req, res) => {
    const userHandler = new UserHandler(req.headers.authorization);
    const data = await userHandler.withdrawalAmount(req.body);
    return res.status(200).json({ error: false, data: data })
}