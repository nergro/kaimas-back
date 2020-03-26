import { Request, Response } from 'express';
import { Cabin } from '../models/cabin';
import { CabinType } from '../types/cabin';

// export const create = async (req: Request, res: Response) => {
//     const { name,description,price,capacity } = req.body as CabinType;
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
