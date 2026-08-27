require('dotenv/config');
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const path = require('node:path');
const cookieParser = require('cookie-parser');
const { indexRouter } = require('./routes/indexRouter');
const { notFound } = require('./middleware/auth');
const { errorController } = require('./middleware/errorController');
const { corsOptions } = require('./config/corsOptions');
const { credentials } = require('./middleware/credentials');
const { startSessionPruning } = require('./jobs/pruneSessions');

const PORT = process.env.PORT || 3333;

require('./config/passport')(passport);

const app = express();
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

app.use('/api', indexRouter);
app.use('*', notFound);
app.use(errorController);

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
  startSessionPruning();
});
