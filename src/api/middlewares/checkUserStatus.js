const {jwt, User} = require('../helper/includes')

const checkUserStatus = async (req, res, next) => {
  const token = req.cookies.jwt;
  const email = jwt.verifyToken(token).email;

  const userstatus = await User.findOne({email}, {_id: 0, status: 1})
  if(!userstatus.status){
    throw new Error('Admin Aprooval Required');
  }
  next();
};

module.exports = checkUserStatus;
