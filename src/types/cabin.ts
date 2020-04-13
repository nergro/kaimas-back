import { Document } from 'mongoose';
import { ImageType } from './image';

export interface CabinType extends Document {
    id: string;
    nameLT: string;
    descriptionLT: string;
    nameEN: string;
    descriptionEN: string;
    price: number;
    capacity: number;
    images: ImageType[];
    benefits: string[];
}
