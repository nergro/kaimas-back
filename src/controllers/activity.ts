import { Request, Response } from 'express';
import { Activity } from '../models/activity';
import { Image } from '../models/image';
import { ActivityType } from '../types/activity';
import { validationResult } from 'express-validator';
import { QueryParams } from '../types/queryParams';
import cloudinary from 'cloudinary';
import { AvailableDate } from '../models/availableDate';

export const create = async (req: Request, res: Response) => {
    const {
        name,
        description,
        price,
        category,
        capacity,
        images,
        benefits
    } = req.body as ActivityType;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const imageModels = await Promise.all(
            images.map((image) =>
                new Image({
                    imageUrl: image.imageUrl,
                    imageId: image.imageId
                }).save()
            )
        );
        const activity = new Activity({
            name,
            description,
            price,
            capacity,
            category,
            images: imageModels,
            benefits
        });
        await activity.save();
        res.status(200).json(activity);
    } catch (error) {
        res.status(400).send({ error: 'Bad request' });
    }
};

export const edit = async (req: Request, res: Response) => {
    const {
        name,
        description,
        price,
        capacity,
        category,
        images,
        benefits
    } = req.body as ActivityType;
    const { id } = req.params;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const activity = await Activity.findById(id);
        if (activity) {
            await Promise.all(
                activity.images.map((image) => Image.findByIdAndDelete(image))
            );

            const imageModels = await Promise.all(
                images.map((image) =>
                    new Image({
                        imageUrl: image.imageUrl,
                        imageId: image.imageId
                    }).save()
                )
            );

            const update = {
                name,
                description,
                price,
                capacity,
                category,
                images: imageModels,
                benefits
            };
            await Activity.findByIdAndUpdate(id, update);
            res.status(200).send({ msg: 'Activity updated' });
        } else {
            res.status(404).json({ msg: 'Activity not found' });
        }
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

        const totalActivities = await Activity.find();

        const activities = await Activity.find()
            .skip(skip)
            .limit(parseInt(perPage))
            .sort({ [sort]: order });

        res.status(200).json({
            items: activities,
            total: totalActivities.length
        });
    } catch (error) {
        res.status(400).send({ error: 'Bad request' });
    }
};

export const getOne = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const activity = await Activity.findById(id);

        const images =
            activity && activity.images
                ? await Promise.all(
                      activity.images.map((image) => Image.findById(image))
                  )
                : [];

        const availableDates = await AvailableDate.find({ serviceId: id });

        if (activity) {
            res.status(200).json({
                id: activity.id,
                name: activity.name,
                description: activity.description,
                price: activity.price,
                capacity: activity.capacity,
                category: activity.category,
                images: images.map((x) => ({
                    imageUrl: x ? x.imageUrl : '',
                    imageId: x ? x.imageId : ''
                })),
                availableDates: availableDates.map((date) => date.id),
                benefits: activity.benefits
            });
        } else {
            res.status(404).json({ msg: 'Cabin not found' });
        }
    } catch (error) {
        res.status(400).send({ error: 'Bad request' });
    }
};

export const deleteOne = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const activity = await Activity.findByIdAndDelete(id);

        if (activity) {
            const deletedOldImages = await Promise.all(
                activity.images.map((image) => Image.findByIdAndDelete(image))
            );
            deletedOldImages.forEach((image) => {
                image && removeImage(image.imageId);
            });

            res.status(200).json(activity);
        } else {
            res.status(404).json({ msg: 'Cabin not found' });
        }
    } catch (error) {
        res.status(400).send({ error: 'Bad request' });
    }
};

export const deleteMany = async (req: Request, res: Response) => {
    try {
        const { ids } = req.body;

        const activities: ActivityType[] | null = await Promise.all(
            ids.map((id: number) => Activity.findByIdAndDelete(id))
        );

        activities.forEach(async (activity) => {
            if (activity) {
                const deletedOldImages = await Promise.all(
                    activity.images.map((image) =>
                        Image.findByIdAndDelete(image)
                    )
                );
                deletedOldImages.forEach((image) => {
                    image && removeImage(image.imageId);
                });
            }
        });

        res.status(200).json(activities);
    } catch (error) {
        res.status(400).send({ error: 'Bad request' });
    }
};

const removeImage = (removableImageId: string) => {
    cloudinary.v2.uploader.destroy(removableImageId);
};
