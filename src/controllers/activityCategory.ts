import { Request, Response } from 'express';
import { ActivityCategory } from '../models/activityCategory';
import { ActivityCategoryType } from '../types/activityCategory';
import { QueryParams } from '../types/queryParams';
import { validationResult } from 'express-validator';

export const create = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { nameLT, nameEN } = req.body as ActivityCategoryType;
    try {
        const activityCategory = new ActivityCategory({ nameLT, nameEN });
        await activityCategory.save();
        res.status(200).json(activityCategory);
    } catch (error) {
        res.status(400).send({ error: 'Bad request' });
    }
};

export const edit = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { nameLT, nameEN } = req.body as ActivityCategoryType;
    const { id } = req.params;
    try {
        const activityCategory = await ActivityCategory.findById(id);
        if (activityCategory) {
            const update = {
                nameLT,
                nameEN
            };
            await ActivityCategory.findByIdAndUpdate(id, update);
            res.status(200).send({ msg: 'Activity category updated' });
        } else {
            res.status(404).json({ msg: 'Activity category not found' });
        }
    } catch (error) {
        res.status(400).send({ error: 'Bad request' });
    }
};

export const getOne = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const activityCategory = await ActivityCategory.findById(id);
        res.status(200).json(activityCategory);
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

        const total = await ActivityCategory.find();

        const activityCategories = await ActivityCategory.find()
            .skip(skip)
            .limit(parseInt(perPage))
            .sort({ [sort]: order });

        res.status(200).json({
            items: activityCategories,
            total: total.length
        });
    } catch (error) {
        res.status(400).send({ error: 'Bad request' });
    }
};

export const deleteOne = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const activityCategory = await ActivityCategory.findByIdAndDelete(id);
        res.status(200).json(activityCategory);
    } catch (error) {
        res.status(400).send({ error: 'Bad request' });
    }
};

export const deleteMany = async (req: Request, res: Response) => {
    const { ids } = req.body;
    try {
        const activityCategories = await Promise.all(
            ids.map((id: number) => ActivityCategory.findByIdAndDelete(id))
        );

        res.status(200).json(activityCategories);
    } catch (error) {
        res.status(400).send({ error: 'Bad request' });
    }
};
