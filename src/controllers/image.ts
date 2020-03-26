import { Request, Response } from 'express';
import { Image } from '../models/image';
import { ImageType } from '../types/image';
import cloudinary from 'cloudinary';

cloudinary.v2.config({
    cloud_name: 'dmckzsz3u',
    api_key: '175283364765328',
    api_secret: 'PlbLsvxZgx82FKJk3JiUUiKyosc'
});

export const create = async (req: Request, res: Response) => {
    const { imageUrl, imageId } = req.body as ImageType;
    try {
        const image = new Image({ imageUrl, imageId });
        await image.save();
        res.status(200).json(image);
    } catch (error) {
        res.status(400).send({ error: 'Bad request' });
    }
};

export const remove = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const image = await Image.findByIdAndDelete(id);
        if (image) {
            removeImage(image.imageId);
        }
        res.status(200).json('Image deleted');
    } catch (error) {
        res.status(400).send({ error: 'Bad request' });
    }
};

const removeImage = (removableImageId: string) => {
    cloudinary.v2.uploader.destroy(removableImageId);
};
