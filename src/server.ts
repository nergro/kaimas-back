import { config } from 'dotenv';
config();
import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Application } from 'express';
import morgan from 'morgan';
import passport from 'passport';

import { logger } from './logging';
import * as router from './routes';
import { connectDB } from './db';

connectDB();

const app: Application = express();
const port: string = process.env.PORT as string;

app.use(cors());

app.use(bodyParser.json());

app.use(passport.initialize());

app.use('/api/', router.test);

if (process.env.NODE_ENV === 'local') {
    app.use(morgan('combined'));
}

app.listen(port, () => logger.log('info', `server is listening on ${port}`));
