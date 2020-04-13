import mongoose from 'mongoose';
import { ActivityType } from '../types/activity';

const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
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
    category: {
        type: Schema.Types.ObjectId,
        ref: 'ActivityCategory'
    },
    price: {
        type: Number,
        required: true
    },
    capacity: {
        type: Number,
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

ActivitySchema.set('toJSON', {
    virtuals: true
});

export const Activity = mongoose.model<ActivityType>(
    'Activity',
    ActivitySchema
);
