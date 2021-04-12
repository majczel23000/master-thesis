import mongoose, { Schema } from 'mongoose';

const FaqSchema = new Schema({
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
    elements: [{
        question: String,
        answear: String
    }],
    status: {
        type: String,
        required: true
    }
});

export default mongoose.model('Faq', FaqSchema);