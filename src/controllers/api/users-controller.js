require('dotenv').config()
const bcrypt = require('bcrypt')
const User = require('../../models/user-model')
const salt = process.env.saltRounds || 10

const serializeUser = (user) => {
  return {
    name: user.name,
    id: user.id,
    email: user.email
  }
}

const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body
      
    if (name && email && password) {
      const user = await User.findOne({ email }).lean()

      if (user) {
        res.status(400).json({ result: 'Error', error: 'The user already exists' })
      } else {
        const hashPass = await bcrypt.hash(password, Number(salt))

        const newUser = new User({
            email,
            name,
            password: hashPass, 
          })

          await newUser.save()
          req.session.user = serializeUser(newUser)

          res.json({ result: 'Successfully', data : { name } })
      }
    } 
      else {
        res.status(400).json({ result: 'Error', error: 'Missing Email or Password' })
      }
  } catch (e) {
      console.log(e.message)
      let error
      if (e.message.includes('duplicate key error')) {
        error = 'The user already exists'
      } else {
        error = e.message
      }
      
      res.status(500).json({ result: 'Error', error })
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

          res.json({ result: 'Successfully', data : { name: user.name } })
        } else {
            res.status(400).json({ result: 'Error', error: 'Wrong Email or Password' })
        }
      } else {
          res.status(400).json({ result: 'Error', error: 'Wrong Email or Password' })
      }
  } else {
      res.status(400).json({ result: 'Error', error: 'Missing Email or Password' })
  }
    } catch (e) {
        res.status(500).json({ result: 'Error', error: 'User not found please try again' })
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
    res.status(500).json({ error: 'Session destroy error' })
  }
}

module.exports = {
  signUp,
  signIn,
  logout
}
