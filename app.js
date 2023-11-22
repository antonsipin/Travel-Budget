require('@babel/register')
require('dotenv').config()

const express = require('express')
const logger = require('morgan')
const methodOverride = require('method-override')
const session = require('express-session')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')(session)
const app = express()
const path = require('path')
const indexRoute = require('./src/routes/index')
const usersRoute = require('./src/routes/users')
const accountRoute = require('./src/routes/account')
const newtripRoute = require('./src/routes/newtrip')
const dbConnect = require('./src/config/db')
const userMiddle = require('./src/middleware/user')
const removeHeader = require('./src/middleware/removeHeader')
const ssr = require('./src/middleware/ssr')
const mailRoute = require('./src/routes/mail')
const fs = require('fs')
const PORT = process.env.PORT || 3100
dbConnect()

app.set('session cookie name', 'sid')
app.set('views', path.join(__dirname, 'src', 'views'))
app.set('view engine', 'jsx')
app.engine('jsx', require('express-react-views').createEngine())

const serverLogStream = fs.createWriteStream(path.resolve('./server.log'), { flags: 'a' })
app.use(logger('combined', { stream: serverLogStream }))

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(session({
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    mongooseConnection: mongoose.createConnection(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wrnxb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`),
    // Use for local db instead mongooseConnection:
    // mongooseConnection: mongoose.createConnection(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`),
  }),
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
  },
}))

app.use(methodOverride('_method'))
app.use(userMiddle.userName)
app.use(removeHeader)
app.use(ssr)
app.use('/', indexRoute)
app.use('/users', usersRoute)
app.use('/account', userMiddle.isAuth, accountRoute)
app.use('/newtrip', userMiddle.isAuth, newtripRoute)
app.use('/mail', mailRoute)

app.use(function (req, res) {
  const { username } = res.locals
  res.render('NotFound', { username })
})

app.listen(PORT, () => {
  console.log('Server has been started on port: ', PORT)
})

module.exports = app
