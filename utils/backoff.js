const {
  LOGIN_BACKOFF_BASE_MS,
  LOGIN_BACKOFF_MAX_MS,
  LOGIN_FAIL_THRESHOLD
} = require('../lib/constants');

function backoffMs(failedAttempts) {
  const over = failedAttempts - LOGIN_FAIL_THRESHOLD;
  return Math.min(LOGIN_BACKOFF_BASE_MS * 2 ** over, LOGIN_BACKOFF_MAX_MS);
}

module.exports = { backoffMs };
