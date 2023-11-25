const express = require('express')
const router = express.Router()
const authController = require('../../controllers/render/auth-controller')

router
  .route('/signup')
  .get(authController.renderSignUp)

router
  .route('/login')
  .get(authController.renderLogIn)

module.exports = router
