let { decryptJwtToken } = require('../config/jwt');
let prisma = require('../model/connection');

const verifyToken = async (req, res, next) => {
  try {
    let token = req.headers['authorization']
    if (!token) {
      let err = new Error(`No token provided!`);
      err.status = 403;
      return next(err);
    }
    token = token.split(' ')[1];
    let user = await decryptJwtToken(token);

    if (!user) {
      let err = new Error(`Invalid token provided!`);
      err.status = 401;
      return next(err);
    }

    let count = await prisma.usermaster.count({
      where: {
        id: +(user.id)
      }
    });
    if (count === 0) {
      let err = new Error(`No user found.`);
      err.status = 401;
      return next(err);
    }
    req.user = user;
    next();
  } catch (e) {
    return next(e);
  }
};


module.exports = { verifyToken };


