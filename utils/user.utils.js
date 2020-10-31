const basicDetails = (user) => {
  const { _id, name, email, avatarUrl, fullName } = user;
  return { _id, name, email, avatarUrl, fullName };
};

module.exports = { basicDetails };
