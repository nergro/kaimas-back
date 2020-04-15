import { validationResult } from 'express-validator';
import { Request, Response } from 'express';
import { Subscriber } from '../models/subscriber';
import jwt from 'jsonwebtoken';
import { getEnvironmentVariableString } from '../services/environmentVariable';
import { SubscribeJWTPayload } from '../types/subscribe';
import {
    sendSubscribtionCancellationToken,
    sendSubscribtionCancellationConfirmation
} from '../services/mailer';

export const subscribe = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email } = req.body;
    try {
        let subscriber = await Subscriber.findOne({ email });
        if (subscriber) {
            return res
                .status(409)
                .json({ errors: [{ msg: 'Already subscribed' }] });
        }
        subscriber = new Subscriber({ email });
        await subscriber.save();

        const payload: SubscribeJWTPayload = {
            id: subscriber.id,
            email: subscriber.email
        };

        jwt.sign(
            payload,
            getEnvironmentVariableString('JWT_SECRET'),
            {},
            (err, token) => {
                if (err) throw err;
                const url = `${getEnvironmentVariableString(
                    'FRONT_URL'
                )}/subscribtion/${token}`;
                sendSubscribtionCancellationToken(email, url);
                res.status(200).json('Success');
            }
        );
    } catch (error) {
        res.status(400).send({ error: 'Bad request' });
    }
};

export const cancel = async (req: Request, res: Response) => {
    const { token } = req.params;
    try {
        const decoded = jwt.verify(
            token,
            getEnvironmentVariableString('JWT_SECRET')
        ) as SubscribeJWTPayload;
        const subscriber = await Subscriber.findByIdAndDelete(decoded.id);
        if (subscriber) {
            sendSubscribtionCancellationConfirmation(decoded.email);
            return res.status(200).json('Subscribtion cancelled');
        } else {
            res.status(400).send({ error: 'Bad request' });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: 'Bad request' });
    }
};
