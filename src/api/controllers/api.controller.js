const { APIHandler } = require("../class/APIHandler")

exports.utrChecker = async (req, res) => {
    const apiHandler = new APIHandler();
    const data = await apiHandler.transaction(req.query, res);
    return res.status(200).json(data)
}

exports.addtransaction = async (req, res) => {
    const apiHandler = new APIHandler();
    const data = await apiHandler.addtransaction(req.query);
    return res.status(200).json(data)
}


