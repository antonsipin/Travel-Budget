require('@babel/register')
require('dotenv').config()

const express = require('express')
const app = express()
const serverConfig = require('./src/config/serverConfig')
const path = require('path')
const indexRoute = require('./src/routes/render/index')
const usersRoute = require('./src/routes/api/users')
const authRoute = require('./src/routes/render/auth')
const accountsRoute = require('./src/routes/render/accounts')
const tripsRoute = require('./src/routes/render/trips')
const mailsRoute = require('./src/routes/render/mails')
const { dbConnect } = require('./src/config/db')
const usersMiddle = require('./src/middleware/users')
const PORT = process.env.PORT || 3100

dbConnect()
serverConfig(app)

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(usersMiddle.userName)
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
