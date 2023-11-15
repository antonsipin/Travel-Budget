const Account = require('../views/Account')
const { getHtml, docType } = require('../utils/index')

const account = (req, res) => {
  try {
    res.write(docType)
    res.end(getHtml(Account, { 
      error: '', 
      userName: req.session.user.name 
    }))
  } catch (e){
    console.log(e.message)
  }
}

module.exports = {
  account
}
