import express from 'express';
import cors from 'cors';
import passport from 'passport';
import path from 'node:path';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { indexRouter } from './routes/indexRouter';
import { notFound } from './middleware/auth';
import { errorController } from './middleware/errorController';
import { corsOptions } from './config/corsOptions';
import { credentials } from './middleware/credentials';

import passportConfig from './config/passport';
passportConfig(passport);

const app = express();
// may be needed in prod
// app.set('trust proxy', 1);
app.use(credentials);
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api', indexRouter);
app.use('*', notFound);
app.use(errorController);

export { app };
