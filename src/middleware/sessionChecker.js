const sessionChecker = (req, res, next) => {
    const { user } = req.session

    if (user) {
        res.redirect('/accounts')
    } else {
        next()
    }
}

module.exports = sessionChecker