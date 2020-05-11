import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { UserInterface } from '../types/user';
import { OrderBody } from '../types/order';
import { AvailableDate } from '../models/availableDate';
import { Order } from '../models/order';
import { User } from '../models/user';
import { SubscribeJWTPayload } from '../types/subscribe';
import { getEnvironmentVariableString } from '../services/environmentVariable';
import jwt from 'jsonwebtoken';
import {
    sendOrderConfirmation,
    sendOrderCancellationConfirmation
} from '../services/mailer';
export const create = async (req: Request, res: Response) => {
    if (req.user === undefined) {
        return res.status(401).send('Unauthorized');
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id: userId } = req.user as UserInterface;
    const { datesIds, date, onModel, serviceId, price } = req.body as OrderBody;
    try {
        const availableDateUpdate = {
            isReserved: true,
            reservedUserId: userId
        };

        await Promise.all(
            datesIds.map((dateId) =>
                AvailableDate.findByIdAndUpdate(dateId, availableDateUpdate)
            )
        );

        const order = await new Order({
            serviceId,
            onModel,
            date,
            price,
            userId,
            reservedDates: datesIds
        }).save();

        const user = await User.findById(userId);

        if (user) {
            const payload: SubscribeJWTPayload = {
                id: order.id,
                email: user.email
            };

            jwt.sign(
                payload,
                getEnvironmentVariableString('JWT_SECRET'),
                {},
                (err, token) => {
                    if (err) throw err;
                    const url = `${getEnvironmentVariableString(
                        'FRONT_URL'
                    )}/order/${token}`;
                    sendOrderConfirmation(user.email, url);
                    res.status(200).json('Success');
                }
            );
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: 'Bad request' });
    }
};

export const get = async (req: Request, res: Response) => {
    if (req.user === undefined) {
        return res.status(401).send('Unauthorized');
    }
    const { id: userId } = req.user as UserInterface;

    try {
        const orders = await Order.find({ userId })
            .populate('reservedDates')
            .populate('serviceId');
        res.status(200).send(orders);
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
        const order = await Order.findByIdAndDelete(decoded.id);
        if (order) {
            sendOrderCancellationConfirmation(decoded.email);
            return res.status(200).json('Order cancelled');
        } else {
            res.status(400).send({ error: 'Bad request' });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: 'Bad request' });
    }
};
