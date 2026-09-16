import 'dotenv/config';
import { validateEnv } from './config/validateEnv';

validateEnv();

import { app } from './app';
import { startSessionPruning } from './jobs/pruneSessions';

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
  startSessionPruning();
});
