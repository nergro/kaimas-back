import { Document } from 'mongoose';

export interface ImageType extends Document {
    id: string;
    imageUrl: string;
    imageId: string;
}
