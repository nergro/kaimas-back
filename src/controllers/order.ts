import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { UserInterface } from '../types/user';
import { OrderBody } from '../types/order';
import { AvailableDate } from '../models/availableDate';
import { Order } from '../models/order';
import { User } from '../models/user';

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

        await new Order({
            serviceId,
            onModel,
            date,
            price,
            userId,
            reservedDates: datesIds
        }).save();

        res.status(200).send('Success');
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
