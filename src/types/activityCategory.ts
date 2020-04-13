import { Document } from 'mongoose';

export interface ActivityCategoryType extends Document {
    id: string;
    nameLT: string;
    nameEN: string;
}
