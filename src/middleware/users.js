const isAuth = (req, res, next) => {
  try {
    if (req.session.user) {
      return next()
    } else {
      res.redirect ('/auth/login')
    }
  } catch (e) {
    console.log(e.message)
  }
}

const userName = (req, res, next) => {
  try {
    if (req.session.user) {
      res.locals.username = req.session.user.name
    }
    next()
  } catch (e) {
    console.log(e.message)
  }
}

module.exports = {
    isAuth,
    userName
} 
