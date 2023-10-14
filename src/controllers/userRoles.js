module.exports = {ADMIN: 'admin',USER: 'user',PREMIUM: 'premium',

  isValidRole: (role) => {
    return [module.exports.ADMIN, module.exports.USER, module.exports.PREMIUM].includes(role);
  },
};
