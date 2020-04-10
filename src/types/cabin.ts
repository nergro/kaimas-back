import { Document } from 'mongoose';
import { ImageType } from './image';

export interface CabinType extends Document {
    id: string;
    name: string;
    description: string;
    price: number;
    capacity: number;
    images: ImageType[];
    benefits: string[];
}
