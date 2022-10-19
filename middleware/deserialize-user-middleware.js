const User = require("./../models/User.model");

const deserializeUserMiddleware = (req, res, next) => {
  const userId = req.session.userId;
  if (userId) {
    User.findById(userId)
      .then((user) => {
        req.user = user;
        res.locals.user = user;
        next();
      })
      .catch((error) => {
        next(error);
      });
  } else {
    next();
  }
};

module.exports = deserializeUserMiddleware;
