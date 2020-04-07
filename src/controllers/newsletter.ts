import { Request, Response } from 'express';
import { Newsletter } from '../models/newsletter';
import { NewsletterType } from '../types/newsletter';
import { QueryParams } from '../types/queryParams';
import { validationResult } from 'express-validator';
import { Subscriber } from '../models/subscriber';
import { sendNewsletters } from '../services/mailer';

export const send = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { topic, content } = req.body as NewsletterType;
    try {
        const fetchedSubscribers = await Subscriber.find();
        await sendNewsletters(
            fetchedSubscribers.map((x) => x.email),
            content,
            topic
        );
        const now = new Date();
        const newsletter = new Newsletter({ topic, content, date: now });
        await newsletter.save();

        res.status(200).json(newsletter);
    } catch (error) {
        res.status(400).send({ error: 'Bad request' });
    }
};

export const getOne = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const newsletter = await Newsletter.findById(id);
        res.status(200).json(newsletter);
    } catch (error) {
        res.status(400).send({ error: 'Bad request' });
    }
};

export const getAll = async (req: Request, res: Response) => {
    try {
        const { order, page, perPage, sort } = req.query as QueryParams;

        let skip = 0;
        if (page && perPage) {
            skip = parseInt(page) * parseInt(perPage) - parseInt(perPage);
        }

        const total = await Newsletter.find();

        const newsletters = await Newsletter.find()
            .skip(skip)
            .limit(parseInt(perPage))
            .sort({ [sort]: order });

        res.status(200).json({ items: newsletters, total: total.length });
    } catch (error) {
        res.status(400).send({ error: 'Bad request' });
    }
};

export const deleteOne = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const newsletter = await Newsletter.findByIdAndDelete(id);
        res.status(200).json(newsletter);
    } catch (error) {
        res.status(400).send({ error: 'Bad request' });
    }
};

export const deleteMany = async (req: Request, res: Response) => {
    const { ids } = req.body;
    try {
        const newsletters = await Promise.all(
            ids.map((id: number) => Newsletter.findByIdAndDelete(id))
        );

        res.status(200).json(newsletters);
    } catch (error) {
        res.status(400).send({ error: 'Bad request' });
    }
};
