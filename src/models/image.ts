import mongoose from 'mongoose';
import { ImageType } from '../types/image';

const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    imageUrl: {
        type: String,
        required: true
    },
    imageId: {
        type: String,
        required: true
    }
});

export const Image = mongoose.model<ImageType>('Image', ImageSchema);
