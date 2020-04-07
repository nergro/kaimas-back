import { Document } from 'mongoose';
import { ImageType } from './image';
import { BenefitType } from './benefit';
import { AvailableDateType } from './availableDate';

export type ActivityCategory = 'water' | 'active' | 'relax';

export interface ActivityType extends Document {
    id: string;
    name: string;
    description: string;
    price: number;
    capacity: number;
    category: string;
    images: ImageType[];
    benefits: BenefitType[];
    availableDates: AvailableDateType[];
}
