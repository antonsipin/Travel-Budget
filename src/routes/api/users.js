const express = require('express')
const router = express.Router()
const usersController = require('../../controllers/api/users-controller')

router
  .route('/signup')
  .post(usersController.signUp)

router
  .route('/login')
  .post(usersController.signIn)

router
  .route('/logout')
  .get(usersController.logout)

module.exports = router
