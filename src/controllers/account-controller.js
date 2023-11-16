const Account = require('../views/Account')

const account = (req, res) => {
  try {
    const { user } = req.session

    res.renderComponent(Account, { 
      username: user?.name 
    })
  } catch (e){
    console.log(e.message)
  }
}

module.exports = {
  account
}
