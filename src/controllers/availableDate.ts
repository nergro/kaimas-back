import { Request, Response } from 'express';
import { AvailableDate } from '../models/availableDate';
import { AvailableDateRequestBody } from '../types/availableDate';
import { QueryParams } from '../types/queryParams';
import { validationResult } from 'express-validator';
import moment from 'moment';

export const create = async (req: Request, res: Response) => {
    const {
        serviceId,
        dateChunks,
        serviceType
    } = req.body as AvailableDateRequestBody;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const oldDates = await AvailableDate.find({ serviceId });

        const filteredDateChunks: string[] = [];
        dateChunks.forEach((x) => {
            let exist = false;
            oldDates.forEach((y) => {
                if (
                    moment(x).format('YYYY-MM-DD') ===
                    moment(y.date).format('YYYY-MM-DD')
                ) {
                    exist = true;
                }
            });
            if (!exist) {
                filteredDateChunks.push(x);
            }
        });

        const dates = await Promise.all(
            filteredDateChunks.map((date) =>
                new AvailableDate({
                    serviceId,
                    date,
                    onModel: serviceType
                }).save()
            )
        );
        res.status(200).json(dates);
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: 'Bad request' });
    }
};

export const getOne = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const aDate = await AvailableDate.findById(id).populate('serviceId');
        res.status(200).send(aDate);
    } catch (error) {
        res.status(400).send({ error: 'Bad request' });
    }
};

export const getByServiceId = async (req: Request, res: Response) => {
    const { serviceId } = req.params;
    try {
        const dates = await AvailableDate.find({
            serviceId,
            isReserved: false
        });
        res.status(200).send(dates);
    } catch (error) {
        res.status(400).send({ error: 'Bad request' });
    }
};

export const getBySeviceType= async (req: Request, res: Response) => {
    const { serviceType } = req.body;
    try {
        const dates = await AvailableDate.find({
            onModel: serviceType,
            isReserved: false
        });
        res.status(200).send(dates);
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
            .populate('serviceId')
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
    try {
        const date = await AvailableDate.findByIdAndDelete(id);
        res.status(200).json(date);
    } catch (error) {
        res.status(400).send({ error: 'Bad request' });
    }
};

export const deleteMany = async (req: Request, res: Response) => {
    const { ids } = req.body;
    try {
        const dates = await Promise.all(
            ids.map((id: number) => AvailableDate.findByIdAndDelete(id))
        );

        res.status(200).json(dates);
    } catch (error) {
        res.status(400).send({ error: 'Bad request' });
    }
};
