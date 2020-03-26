import { Request, Response } from 'express';
import { AvailableDate } from '../models/availableDate';
import { AvailableDateType } from '../types/availableDate';

// export const create = async (req: Request, res: Response) => {
//     const { imageUrl } = req.body as AvailableDateType;
//     try {
//         const image = new Image({ imageUrl });
//         await image.save();
//         res.status(200).json(image);
//     } catch (error) {
//         res.status(400).send({ error: 'Bad request' });
//     }
// };

// export const remove = async (req: Request, res: Response) => {
//     const { id } = req.params;
//     try {
//         await Image.findByIdAndDelete(id);
//         res.status(200).json('Image deleted');
//     } catch (error) {
//         res.status(400).send({ error: 'Bad request' });
//     }
// };
