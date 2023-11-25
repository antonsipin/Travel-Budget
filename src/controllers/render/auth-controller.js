const Login = require('../../views/Login')
const SignUp = require('../../views/SignUp')

const renderSignUp = (req, res) => {
  try {
    res.renderComponent(SignUp, {
      error: ''
    })
  } catch (e) {
    console.log(e.message)
  }
}

const renderLogIn = (req, res) => {
  try {
    res.renderComponent(Login, {
      error: ''
    })
  } catch (e) {
    console.log(e.message)
  }
}

module.exports = {
  renderSignUp,
  renderLogIn,
}
