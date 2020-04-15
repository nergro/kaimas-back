import mongoose from 'mongoose';
import { CabinType } from '../types/cabin';

const Schema = mongoose.Schema;

const CabinSchema = new Schema({
    nameLT: {
        type: String,
        required: true
    },
    nameEN: {
        type: String,
        required: true
    },
    descriptionLT: {
        type: String,
        required: true
    },
    descriptionEN: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    thumbnail: {
        type: Schema.Types.ObjectId,
        ref: 'Image',
        required: true
    },
    images: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Image'
        }
    ],
    benefits: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Benefit'
        }
    ]
});

CabinSchema.set('toJSON', {
    virtuals: true
});

export const Cabin = mongoose.model<CabinType>('Cabin', CabinSchema);
