const express = require('express')
const router = express.Router()
const accountsController = require('../../controllers/render/accounts-controller')

router.get('/', accountsController.account)

module.exports = router
