import mongoose from 'mongoose';
import { NewsletterType } from '../types/newsletter';

const Schema = mongoose.Schema;

const NewsletterSchema = new Schema({
    topic: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

NewsletterSchema.set('toJSON', {
    virtuals: true
});

export const Newsletter = mongoose.model<NewsletterType>(
    'Newsletter',
    NewsletterSchema
);
