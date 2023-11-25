const express = require('express')
const router = express.Router()
const mailsController = require('../../controllers/render/mails-controller')

router
  .route('/')
  .post(mailsController.sendMail)

module.exports = router
