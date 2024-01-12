const searchService = require('../services/search.services');
const logger = require('../utils/logger/logger');

async function search(req, res) {
  try {
    const { keyword } = req.query;
    const result = await searchService(keyword);
    res.json(result);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = search;
