const {jwt, User} = require('../helper/includes')

const tokenCheckEjs = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    res.locals.status = false;
    next();
  } else {
    try {
      const verification = jwt.verifyToken(token);
      if(verification === null){
        res.locals.status = false;
      }else{
        res.locals.status = true;
        const {email} = jwt.verifyToken(token);
        const userstatus = await User.findOne({email}, {_id: 0, status: 1})
        if(!userstatus) return null;
        if(userstatus.status){
          res.locals.statususer = true;
        }else{
          res.locals.statususer = false;
        }
      }
      next();
    } catch (error) {
      console.error(error);
      res.locals.status = false;
      next();
    }
  }
};

module.exports = tokenCheckEjs;
