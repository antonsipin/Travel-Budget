require('dotenv').config()
const mongoose = require('mongoose')

const dbConnectionURL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wrnxb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

// const dbConnectionURL = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`

function dbConnect() {
  mongoose.connect(dbConnectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) return console.log(err)
    return console.log(`Success connected to ${process.env.DB_NAME} database`)
  })
}

module.exports = dbConnect
