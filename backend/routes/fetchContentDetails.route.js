const fetchContentDetailsController = require('../controllers/fetchContentDetails.controller');
const express = require('express');
const router = express.Router();

router.get('/fetchContentDetails', fetchContentDetailsController);

module.exports = router;