import { Request, Response } from 'express';
import { Benefit } from '../models/benefit';
import { BenefitType } from '../types/benefit';
import { QueryParams } from '../types/queryParams';
import { validationResult } from 'express-validator';

export const create = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { description } = req.body as BenefitType;
    try {
        const benefit = new Benefit({ description });
        await benefit.save();
        res.status(200).json(benefit);
    } catch (error) {
        res.status(400).send({ error: 'Bad request' });
    }
};

export const edit = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { description } = req.body as BenefitType;
    const { id } = req.params;
    try {
        const benefit = await Benefit.findById(id);
        if (benefit) {
            const update = {
                description
            };
            await Benefit.findByIdAndUpdate(id, update);
            res.status(200).send({ msg: 'Benefit updated' });
        } else {
            res.status(404).json({ msg: 'Benefit not found' });
        }
    } catch (error) {
        res.status(400).send({ error: 'Bad request' });
    }
};

export const getOne = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const benefit = await Benefit.findById(id);
        res.status(200).json(benefit);
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

        const total = await Benefit.find();

        const benefits = await Benefit.find()
            .skip(skip)
            .limit(parseInt(perPage))
            .sort({ [sort]: order });

        res.status(200).json({ items: benefits, total: total.length });
    } catch (error) {
        res.status(400).send({ error: 'Bad request' });
    }
};

export const deleteOne = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const benefit = await Benefit.findByIdAndDelete(id);
        res.status(200).json(benefit);
    } catch (error) {
        res.status(400).send({ error: 'Bad request' });
    }
};

export const deleteMany = async (req: Request, res: Response) => {
    const { ids } = req.body;
    try {
        const benefits = await Promise.all(
            ids.map((id: number) => Benefit.findByIdAndDelete(id))
        );

        res.status(200).json(benefits);
    } catch (error) {
        res.status(400).send({ error: 'Bad request' });
    }
};
