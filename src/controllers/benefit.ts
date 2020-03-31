import { Request, Response } from 'express';
import { Benefit } from '../models/benefit';
import { BenefitType } from '../types/benefit';
import { QueryParams } from '../types/queryParams';

export const create = async (req: Request, res: Response) => {
    const { description, serviceId, onModel } = req.body as BenefitType;
    try {
        const benefit = new Benefit({ description, serviceId, onModel });
        await benefit.save();
        res.status(200).json(benefit);
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
        const image = await Benefit.findByIdAndDelete(id);
        res.status(200).json(image);
    } catch (error) {
        res.status(400).send({ error: 'Bad request' });
    }
};

export const deleteMany = async (req: Request, res: Response) => {
    const { ids } = req.params;
    try {
        const benefits = await Promise.all(
            ids.map((id: number) => Benefit.findByIdAndDelete(id))
        );

        res.status(200).json(benefits);
    } catch (error) {
        res.status(400).send({ error: 'Bad request' });
    }
};
