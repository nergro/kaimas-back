import { Document } from 'mongoose';
import { ImageType } from './image';
import { BenefitType } from './benefit';
import { AvailableDateType } from './availableDate';

export interface CabinType extends Document {
    id: string;
    name: string;
    description: string;
    price: number;
    capacity: number;
    images: ImageType[];
    benefits: BenefitType[];
    availableDates: AvailableDateType[];
}
