const cookieParser = require('cookie-parser')
const path = require('path')
const fs = require('fs')
const logger = require('morgan')
const methodOverride = require('method-override')
const ssr = require('../middleware/ssr')
const removeHeader = require('../middleware/removeHeader')
const sessionConfig = require('./sessionConfig')
const cors = require('cors')
const corsConfig = require('../config/corsConfig')

const serverConfig = (app) => {
    app.use(cors(corsConfig))
    app.use(cookieParser())
    app.use(methodOverride('_method'))
    sessionConfig(app)
    app.set('views', path.resolve(__dirname, '../views'))

    const serverLogStream = fs.createWriteStream(path.resolve(__dirname, '../../server.log'), { flags: 'a' })
    app.use(logger('combined', { stream: serverLogStream }))

    app.use(ssr)
    app.use(removeHeader)
}

module.exports = serverConfig