require('@babel/register')
require('dotenv').config()

const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const methodOverride = require('method-override')
const session = require('express-session')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')(session)
const app = express()
const path = require('path')
const indexRoute = require('./src/routes/render/index')
const usersRoute = require('./src/routes/api/users')
const authRoute = require('./src/routes/render/auth')
const accountsRoute = require('./src/routes/render/accounts')
const tripsRoute = require('./src/routes/render/trips')
const mailsRoute = require('./src/routes/render/mails')
const { dbConnect, dbConnectionURL } = require('./src/config/db')
const usersMiddle = require('./src/middleware/users')
const removeHeader = require('./src/middleware/removeHeader')
const ssr = require('./src/middleware/ssr')
const fs = require('fs')
const PORT = process.env.PORT || 3100
dbConnect()

app.set('session cookie name', 'sid')
app.set('views', path.join(__dirname, 'src', 'views'))
app.set('view engine', 'jsx')
app.engine('jsx', require('express-react-views').createEngine())

const serverLogStream = fs.createWriteStream(path.resolve('./server.log'), { flags: 'a' })
app.use(logger('combined', { stream: serverLogStream }))

app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(session({
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    mongooseConnection: mongoose.createConnection(dbConnectionURL),
  }),
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
  },
}))

app.use(methodOverride('_method'))
app.use(usersMiddle.userName)
app.use(removeHeader)
app.use(ssr)
app.use('/', indexRoute)
app.use('/auth', authRoute)
app.use('/users', usersRoute)
app.use('/accounts', usersMiddle.isAuth, accountsRoute)
app.use('/trips', usersMiddle.isAuth, tripsRoute)
app.use('/mails', mailsRoute)

app.use(function (req, res) {
  const { username } = res.locals
  res.render('NotFound', { username })
})

app.listen(PORT, () => {
  console.log('Server has been started on port: ', PORT)
})

module.exports = app
