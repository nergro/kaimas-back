import { Request, Response } from 'express';
import { Cabin } from '../models/cabin';
import { Image } from '../models/image';
import { AvailableDate } from '../models/availableDate';
import { CabinType } from '../types/cabin';
import { validationResult } from 'express-validator';
import { QueryParams } from '../types/queryParams';
import cloudinary from 'cloudinary';

export const create = async (req: Request, res: Response) => {
    const {
        nameLT,
        nameEN,
        descriptionLT,
        descriptionEN,
        price,
        capacity,
        address,
        images,
        benefits,
        thumbnail
    } = req.body as CabinType;
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
        const thumbnailModel = await new Image({
            imageUrl: thumbnail.imageUrl,
            imageId: thumbnail.imageId
        }).save();

        const cabin = new Cabin({
            nameLT,
            nameEN,
            descriptionLT,
            descriptionEN,
            price,
            capacity,
            address,
            images: imageModels,
            thumbnail: thumbnailModel,
            benefits
        });
        await cabin.save();
        res.status(200).json(cabin);
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: 'Bad request' });
    }
};

export const edit = async (req: Request, res: Response) => {
    const {
        nameLT,
        nameEN,
        descriptionLT,
        descriptionEN,
        price,
        capacity,
        address,
        images,
        benefits,
        thumbnail
    } = req.body as CabinType;
    const { id } = req.params;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const cabin = await Cabin.findById(id);
        if (cabin) {
            await Promise.all(
                cabin.images.map((image) => Image.findByIdAndDelete(image))
            );
            const imageModels = await Promise.all(
                images.map((image) =>
                    new Image({
                        imageUrl: image.imageUrl,
                        imageId: image.imageId
                    }).save()
                )
            );

            await Image.findByIdAndDelete(cabin.thumbnail);

            const thumbnailModel = await new Image({
                imageUrl: thumbnail.imageUrl,
                imageId: thumbnail.imageId
            }).save();

            const update = {
                nameLT,
                nameEN,
                descriptionLT,
                descriptionEN,
                price,
                capacity,
                address,
                images: imageModels,
                benefits,
                thumbnail: thumbnailModel
            };
            await Cabin.findByIdAndUpdate(id, update);
            res.status(200).send({ msg: 'Cabin updated' });
        } else {
            res.status(404).json({ msg: 'Cabin not found' });
        }
    } catch (error) {
        res.status(400).send({ error: 'Bad request' });
    }
};

export const getList = async (req: Request, res: Response) => {
    try {
        const { order, page, perPage, sort } = req.query as QueryParams;

        let skip = 0;
        if (page && perPage) {
            skip = parseInt(page) * parseInt(perPage) - parseInt(perPage);
        }

        const totalCabins = await Cabin.find();

        const cabins = await Cabin.find()
            .skip(skip)
            .limit(parseInt(perPage))
            .sort({ [sort]: order });

        res.status(200).json({ items: cabins, total: totalCabins.length });
    } catch (error) {
        res.status(400).send({ error: 'Bad request' });
    }
};

export const getAll = async (req: Request, res: Response) => {
    try {
        const cabins = await Cabin.find()
            .populate('thumbnail')
            .populate('images')
            .populate('benefits');

        res.status(200).json(cabins);
    } catch (error) {
        res.status(400).send({ error: 'Bad request' });
    }
};

export const getOne = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const cabin = await Cabin.findById(id);

        const images =
            cabin && cabin.images
                ? await Promise.all(
                      cabin.images.map((image) => Image.findById(image))
                  )
                : [];

        const availableDates = await AvailableDate.find({ serviceId: id });

        const t = cabin && (await Image.findById(cabin.thumbnail));

        if (cabin) {
            res.status(200).json({
                id: cabin.id,
                nameLT: cabin.nameLT,
                nameEN: cabin.nameEN,
                descriptionLT: cabin.descriptionLT,
                descriptionEN: cabin.descriptionEN,
                price: cabin.price,
                capacity: cabin.capacity,
                address: cabin.address,
                images: images.map((x) => ({
                    imageUrl: x ? x.imageUrl : '',
                    imageId: x ? x.imageId : ''
                })),
                availableDates: availableDates.map((date) => date.id),
                benefits: cabin.benefits,
                thumbnail: {
                    imageUrl: t ? t.imageUrl : '',
                    imageId: t ? t.imageId : ''
                }
            });
        } else {
            res.status(404).json({ msg: 'Cabin not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: 'Bad request' });
    }
};

export const deleteOne = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const cabin = await Cabin.findByIdAndDelete(id);

        if (cabin) {
            const deletedOldImages = await Promise.all(
                cabin.images.map((image) => Image.findByIdAndDelete(image))
            );
            deletedOldImages.forEach((image) => {
                image && removeImage(image.imageId);
            });

            await Image.findByIdAndDelete(cabin.thumbnail);

            res.status(200).json(cabin);
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

        const cabins: CabinType[] | null = await Promise.all(
            ids.map((id: number) => Cabin.findByIdAndDelete(id))
        );

        cabins.forEach(async (cabin) => {
            if (cabin) {
                const deletedOldImages = await Promise.all(
                    cabin.images.map((image) => Image.findByIdAndDelete(image))
                );
                deletedOldImages.forEach((image) => {
                    image && removeImage(image.imageId);
                });
                await Image.findByIdAndDelete(cabin.thumbnail);
            }
        });

        res.status(200).json(cabins);
    } catch (error) {
        res.status(400).send({ error: 'Bad request' });
    }
};

const removeImage = (removableImageId: string) => {
    cloudinary.v2.uploader.destroy(removableImageId);
};
