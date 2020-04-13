import { Document } from 'mongoose';
import { ImageType } from './image';

export type ActivityCategory = 'water' | 'active' | 'relax';

export interface ActivityType extends Document {
    id: string;
    nameLT: string;
    nameEN: string;
    descriptionLT: string;
    descriptionEN: string;
    price: number;
    capacity: number;
    category: string;
    images: ImageType[];
    benefits: string[];
}
