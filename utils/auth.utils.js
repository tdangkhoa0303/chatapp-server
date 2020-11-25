const jwt = require("jsonwebtoken");

module.exports.generateToken = async (user, secretSignature, tokenLife) => {
  return new Promise((resolve, reject) => {
    const userData = {
      email: user.email,
      name: user.name,
      fullName: user.fullName,
      avatar: user.avatar,
      _id: user._id,
    };

    jwt.sign(
      { data: userData },
      secretSignature,
      {
        algorithm: "HS256",
        expiresIn: tokenLife,
      },
      (err, token) => {
        if (err) return reject(err);
        resolve(token);
      }
    );
  });
};

module.exports.verifyToken = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
    });
  });
};
