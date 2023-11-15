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
  try {
    res.write(docType)
    res.end(getHtml(SignUp, { error: '' }))
  } catch (e) {
    console.log(e.message)
  }
}

const renderLogIn = (req, res) => {
  try {
    res.write(docType)
    res.end(getHtml(Login, { error: '' }))
  } catch (e) {
    console.log(e.message)
  }
}

const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body
      
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
      console.log(e.message)

      res.write(docType)
      res.end(getHtml(SignUp, { error: 'User not found please try again' }))
    }
}

const signIn = async (req, res) => {
  try {

  const { email, password } = req.body

  if (email && password) {
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
  } else {
    res.write(docType)
    res.end(getHtml(Login, { error: 'Missing Email or Password' }))
  }
    } catch (e) {
        res.write(docType)
        res.end(getHtml(Login, { error: 'User not found please try again' }))
    }
}

const logout = (req, res) => {
  try {
    req.session.destroy(function (err) {
      if (err) throw new Error(err)
      res.clearCookie(req.app.get('session cookie name'))
      return res.redirect('/')
    })
  } catch (e) {
    console.log(e.message)
  }
}

module.exports = {
  renderSignUp,
  renderLogIn,
  signUp,
  signIn,
  logout
}
