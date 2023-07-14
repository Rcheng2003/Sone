const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(new Error('Unauthorized'), 401);
  }
  return jwt.verify(token, "someSecretCode666", (err, decoded) => {
    if (err) {
      return next(new Error('Unauthorized, invalid token'), 401);
    }
    req.user = decoded;
    return next();
  });
};

module.exports = checkAuth;
