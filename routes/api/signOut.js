const express = require('express')
const router = express.Router()
const signOutController = require('../../controllers/signOutController')

router.get('/', signOutController.handleSignOut);

module.exports = router;