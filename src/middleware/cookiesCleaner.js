const cookiesCleaner = (req, res, next) => {
    if (req.app.get('session cookie name') && !req.session.user) {
        res.clearCookie(req.app.get('session cookie name'))
        res.redirect('/auth/login')
    }
    next()
}

module.exports = cookiesCleaner