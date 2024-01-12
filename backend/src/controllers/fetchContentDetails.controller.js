const logger = require('../utils/logger/logger');
const fetchDetailsService = require('../services/fetchContentDetails.services');

async function fetchDetails(req, res) {
  try {
    const { content_id, content_type } = req.body;
    const result = await fetchDetailsService(content_id, content_type);
    res.json(result);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = fetchDetails;