import mongoose from 'mongoose';
import { ActivityCategoryType } from '../types/activityCategory';

const Schema = mongoose.Schema;

const ActivityCategorySchema = new Schema({
    nameLT: {
        type: String,
        required: true
    },
    nameEN: {
        type: String,
        required: true
    }
});

ActivityCategorySchema.set('toJSON', {
    virtuals: true
});

export const ActivityCategory = mongoose.model<ActivityCategoryType>(
    'ActivityCategory',
    ActivityCategorySchema
);
