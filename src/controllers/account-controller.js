const Account = require('../views/Account')
const { getHtml, docType } = require('../utils/index')

const account = (req, res) => {
  res.write(docType)
  res.end(getHtml(Account, { error: '', userName: req.session.user.name }))
}

module.exports = {
  account
}
