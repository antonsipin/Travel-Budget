const Account = require('../views/Account')
const { getHtml, docType } = require('../utils/index')

const account = (req, res) => {
  try {
    const { user } = req.session

    res.write(docType)
    res.end(getHtml(Account, { 
      error: '', 
      userName: user?.name 
    }))
  } catch (e){
    console.log(e.message)
  }
}

module.exports = {
  account
}
