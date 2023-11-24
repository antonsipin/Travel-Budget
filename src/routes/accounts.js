const express = require('express')
const router = express.Router()
const accountsController = require('../controllers/accounts-controller')

router.get('/', accountsController.account)

module.exports = router
