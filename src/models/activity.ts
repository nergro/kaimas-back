import mongoose from 'mongoose';
import { ActivityType } from '../types/activity';

const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
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
    ],
    availableDates: [
        {
            type: Schema.Types.ObjectId,
            ref: 'AvailableDate'
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
