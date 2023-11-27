const session = require('express-session')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')(session)
const { dbConnectionURL } = require('../config/db')

const sessionConfig = (app) => {
    app.set('session cookie name', 'sid')
    
    app.use(session({
        secret: process.env.SESSION_SECRET || 'test',
        store: new MongoStore({
          mongooseConnection: mongoose.createConnection(dbConnectionURL, { useNewUrlParser: true, useUnifiedTopology: true } ),
        }),
        resave: false,
        saveUninitialized: true,
        cookie: {
          secure: false
        },
      }))
}

module.exports = sessionConfig