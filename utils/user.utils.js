const basicDetails = (user) => {
  const { _id, name, email, avatar, fullName } = user;
  return { _id, name, email, avatar, fullName };
};

module.exports = { basicDetails };
