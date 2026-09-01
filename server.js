require('dotenv/config');
const { validateEnv } = require('./config/validateEnv');

validateEnv();

const { app } = require('./app');
const { startSessionPruning } = require('./jobs/pruneSessions');

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
  startSessionPruning();
});
