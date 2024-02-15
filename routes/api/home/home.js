const express = require('express');
const router = express.Router();
const homeContentController = require('../../../controllers/homeContentController')


router.route('/')
    .get(homeContentController.getHomeContents)


module.exports = router