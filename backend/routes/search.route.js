const searchController = require('../controllers/search.controller');
const express = require('express');
const router = express.Router();

router.get('/search', searchController);

module.exports = router;