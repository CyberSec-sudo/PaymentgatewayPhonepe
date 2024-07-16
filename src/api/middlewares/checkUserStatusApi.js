const {jwt, User, UserApi} = require('../helper/includes')

const checkUserStatus = async (req, res, next) => {
  const {apikey, utrid} = req.query;
  if(!apikey || !utrid) throw new Error('api key or utr not found');
  const useremail = await UserApi.findOne({api_key: apikey}, {_id: 0, email: 1})
  if(!useremail) throw new Error('Some Error Occured');

  const userstatus = await User.findOne({email: useremail.email}, {_id: 0, status: 1})
  if(!userstatus.status) throw new Error('Need Admin Approval');
  next();
};

module.exports = checkUserStatus;
