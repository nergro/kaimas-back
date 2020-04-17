import { Request, Response } from 'express';
import { Review } from '../models/review';
import { validationResult } from 'express-validator';
import { ReviewRequestBody } from '../types/review';
import { UserInterface } from '../types/user';

export const create = async (req: Request, res: Response) => {
    const {
        serviceId,
        serviceType,
        date,
        rating,
        comment,
        recommend
    } = req.body as ReviewRequestBody;
    try {
        if (req.user === undefined) {
            console.log(req.user);
            return res.status(401).send('Unauthorized');
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.user as UserInterface;

        const review = new Review({
            user: id,
            serviceId,
            onModel: serviceType,
            date,
            rating,
            comment,
            recommend
        });
        await review.save();
        res.status(200).json(review);
    } catch (error) {
        res.status(400).send({ error: 'Bad request' });
    }
};

export const getAll = async (req: Request, res: Response) => {
    try {
        const { serviceId } = req.params as ReviewRequestBody;
        const reviews = await Review.find({ serviceId }).populate(
            'user',
            'name'
        );

        res.status(200).json(reviews);
    } catch (error) {
        res.status(400).send({ error: 'Bad request' });
    }
};
