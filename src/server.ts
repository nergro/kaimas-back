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
import { auth } from './auth';

connectDB();

const app: Application = express();
const port: string = process.env.PORT as string;

app.use(cors());

app.use(bodyParser.json());

app.use(passport.initialize());
auth(passport);

app.use('/api/', router.test);
app.use('/api/user', router.user);

app.all('*', (req, res) => {
    res.status(404).json({ error: "Endpoint doesn't exist" });
});

if (process.env.NODE_ENV === 'local') {
    app.use(morgan('combined'));
}

app.listen(port, () => logger.log('info', `server is listening on ${port}`));
