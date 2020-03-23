import mongoose from 'mongoose';
import { AvailableDateType } from '../types/availableDate';

const Schema = mongoose.Schema;

const AvailableDateSchema = new Schema({
    description: {
        type: String,
        required: true
    },
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

export const AvailableDate = mongoose.model<AvailableDateType>(
    'AvailableDate',
    AvailableDateSchema
);
