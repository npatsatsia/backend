const express = require('express')
const router = express.Router()
const authController = require('../../controllers/signInController')

router.post('/', authController.handleLogin);

module.exports = router;