import mongoose from 'mongoose';
import { ReviewType } from '../types/review';

const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
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
    },
    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    recommend: {
        type: Boolean,
        required: true
    }
});

ReviewSchema.set('toJSON', {
    virtuals: true
});

export const Review = mongoose.model<ReviewType>('Review', ReviewSchema);
