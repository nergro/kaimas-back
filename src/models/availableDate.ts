import mongoose from 'mongoose';
import { AvailableDateType } from '../types/availableDate';

const Schema = mongoose.Schema;

const AvailableDateSchema = new Schema({
    serviceId: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'onModel'
    },
    onModel: {
        type: String,
        required: true,
        enum: ['Cabin', 'Activity']
    },
    date: {
        type: Date,
        required: true
    }
});

AvailableDateSchema.set('toJSON', {
    virtuals: true
});

export const AvailableDate = mongoose.model<AvailableDateType>(
    'AvailableDate',
    AvailableDateSchema
);
