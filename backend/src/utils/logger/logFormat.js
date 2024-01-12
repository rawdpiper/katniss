function nonRequestLogFormat(component, message) {
  return `${component} ${message}`;
}

function requestLogFormat(req, message) {
  return `[${req.method} ${req.originalUrl}] ${message}`;
}

module.exports = {
  nonRequestLogFormat,
  requestLogFormat,
};
