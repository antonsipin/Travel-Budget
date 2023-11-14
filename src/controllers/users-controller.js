require('dotenv').config()
const Login = require('../views/Login')
const SignUp = require('../views/SignUp')
const bcrypt = require('bcrypt')
const User = require('../models/user-model')
const salt = process.env.saltRounds || 10
const { getHtml, docType } = require('../utils/index')
const Account = require('../views/Account')

const serializeUser = (user) => {
  return {
    name: user.name,
    id: user.id,
    email: user.email
  }
}

const renderSignUp = (req, res) => {
  res.write(docType)
  res.end(getHtml(SignUp, { error: '' }))
}

const renderLogIn = (req, res) => {
  res.write(docType)
  res.end(getHtml(Login, { error: '' }))
}

const signUp = async (req, res) => {
  const { name, email, password } = req.body
  try {
      
    if (name && email && password) {
      const hashPass = await bcrypt.hash(password, Number(salt))

        const newUser = new User({
            email,
            name,
            password: hashPass, 
          })

          await newUser.save()
          req.session.user = serializeUser(newUser)
          res.redirect('/account')
        } 
      else {
        res.write(docType)
        res.end(getHtml(SignUp, { error: 'Missing Email or Password' }))
      }
  } catch (e) {
        res.write(docType)
        res.end(getHtml(SignUp, { error: 'User not found please try again' }))
    }
}

const signIn = async (req, res) => {
  const { email, password } = req.body

  if (email && password) {
    try {
      const user = await User.findOne({ email }).lean()
      if (user) {
        const validPassword = await bcrypt.compare(password, user.password)
        if (validPassword) {
          req.session.user = serializeUser(user)
          res.write(docType)
          res.end(getHtml(Account, { error: '', userName: req.session?.user?.name }))
        } else {
          res.write(docType)
          res.end(getHtml(Login, { error: 'Wrong Email or Password' }))
        }
      } else {
          res.write(docType)
          res.end(getHtml(Login, { error: 'Wrong Email or Password' }))
      }
    } catch (e) {
        res.write(docType)
        res.end(getHtml(Login, { error: 'User not found please try again' }))
    }

  } else {
    res.write(docType)
    res.end(getHtml(Login, { error: 'Missing Email or Password' }))
  }
}

const logout = (req, res) => {
  req.session.destroy(function (err) {
    if (err) throw new Error(err)
    res.clearCookie(req.app.get('session cookie name'))
    return res.redirect('/')
  })
}

module.exports = {
  renderSignUp,
  renderLogIn,
  signUp,
  signIn,
  logout
}
