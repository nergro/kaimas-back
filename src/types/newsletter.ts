import { Document } from 'mongoose';

export interface NewsletterType extends Document {
    id: string;
    topic: string;
    content: string;
    date: string;
}
