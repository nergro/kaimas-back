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
    address: string;
    thumbnail: ImageType;
    images: ImageType[];
    benefits: string[];
}

export interface CabinListType {
    id: string;
    nameLT: string;
    descriptionLT: string;
    nameEN: string;
    descriptionEN: string;
    price: number;
    capacity: number;
    thumbnail: string;
    images: ImageType[];
    benefits: string[];
}
