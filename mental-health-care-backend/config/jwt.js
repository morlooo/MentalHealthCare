const jwt = require("jsonwebtoken");
var dotenv = require("dotenv");
dotenv.config({ path: ".env" });
let secret = process.env.JWT_SECRET;

const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    isAdmin: user.isAdmin,
  };

  let token = jwt.sign(payload, secret, {
    expiresIn: "24h",
    algorithm: "HS256",
  });
  return { token, payload };
};

const decryptJwtToken = (token) => {
  try {
    const decoded = jwt.verify(token, secret);
    if (!decoded) return false;
    return decoded;
  } catch (e) {
    if (e.name && e.name === "TokenExpiredError") {
      e.status = 401;
      throw e;
    } else {
      throw e;
    }
  }
};

module.exports = { generateToken, decryptJwtToken };
