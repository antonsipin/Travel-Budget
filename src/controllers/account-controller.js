const Account = require('../views/Account')

const account = (req, res) => {
  try {
    const { username } = res.locals

    res.renderComponent(Account, { 
      username
    })
  } catch (e){
    console.log(e.message)
  }
}

module.exports = {
  account
}
