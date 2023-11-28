const urls = require('../utils/index')

const corsConfig = {
    origin: urls,
    optionSuccessStatus: 200,
    credentials: true
}

module.exports = corsConfig