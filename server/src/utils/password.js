const bcrypt = require('bcryptjs');
const config = require('../config');

const hashPassword = async (plain) => bcrypt.hash(plain, config.bcryptSaltRounds);

const comparePassword = async (plain, hash) => {
  if (!plain || !hash) return false;
  return bcrypt.compare(plain, hash);
};

module.exports = {
  hashPassword,
  comparePassword,
};
