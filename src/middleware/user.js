const isAuth = (req, res, next) => {
    if (req.session.user) {
        return next()
    } else {
      res.redirect ('/users/login')
    }
}
const userName = (req, res, next) => {
  if (req.session.user) {
    res.locals.username = req.session.user.name
  }
  next()
}

module.exports = {
    isAuth,
    userName
} 
