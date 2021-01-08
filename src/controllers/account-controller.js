const User = require('../models/user-model')

const account = (req, res) => {
  
  res.render('account')
};

module.exports = {
  account
};
