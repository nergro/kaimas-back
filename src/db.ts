import mongoose from 'mongoose';
import { getEnvironmentVariableString } from './services/environmentVariable';

export const connectDB = async () => {
    const db = getEnvironmentVariableString('MONGO_URI');
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};
