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
import cloudinary from 'cloudinary';
import { getEnvironmentVariableString } from './services/environmentVariable';

connectDB();

const app: Application = express();
const port: string = process.env.PORT as string;

cloudinary.v2.config({
    cloud_name: getEnvironmentVariableString('CLOUDINARY_CLOUD_NAME'),
    api_key: getEnvironmentVariableString('CLOUDINARY_API_KEY'),
    api_secret: getEnvironmentVariableString('CLOUDINARY_API_SECRET')
});

app.use(cors());

app.use(bodyParser.json());

app.use(passport.initialize());
auth(passport);

app.use('/api/user', router.user);
app.use('/api/subscribe', router.subscribe);
app.use('/api/image', router.image);
app.use('/api/cabin', router.cabin);
app.use('/api/availableDate', router.availableDate);
app.use('/api/benefit', router.benefit);
app.use('/api/activity', router.activity);
app.use('/api/activityCategory', router.activityCategory);

app.all('*', (req, res) => {
    res.status(404).json({ error: "Endpoint doesn't exist" });
});

if (process.env.NODE_ENV === 'local') {
    app.use(morgan('combined'));
}

app.listen(port, () => logger.log('info', `server is listening on ${port}`));
