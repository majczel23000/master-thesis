import mongoose, { Schema } from 'mongoose';

const SettingsSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date
    },
    updatedAt: {
        type: Date,
        default: new Date
    },
    description: {
        type: String
    },
    type: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
});

export default mongoose.model('Settings', SettingsSchema);