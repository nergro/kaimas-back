import { Request, Response } from 'express';
import { AvailableDate } from '../models/availableDate';
import { AvailableDateType } from '../types/availableDate';
import { QueryParams } from '../types/queryParams';
import { validationResult } from 'express-validator';

export const create = async (req: Request, res: Response) => {
    const { serviceId, date, onModel } = req.body as AvailableDateType;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const aDate = new AvailableDate({ serviceId, date, onModel });
        await aDate.save();
        res.status(200).json(aDate);
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: 'Bad request' });
    }
};

export const getOne = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const aDate = await AvailableDate.findById(id);
        res.status(200).send(aDate);
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

        const total = await AvailableDate.find();

        const dates = await AvailableDate.find()
            .skip(skip)
            .limit(parseInt(perPage))
            .sort({ [sort]: order });

        res.status(200).json({ items: dates, total: total.length });
    } catch (error) {
        res.status(400).send({ error: 'Bad request' });
    }
};

export const deleteOne = async (req: Request, res: Response) => {
    const { id } = req.params;
};

export const deleteMany = async (req: Request, res: Response) => {
    const { id } = req.params;
};
