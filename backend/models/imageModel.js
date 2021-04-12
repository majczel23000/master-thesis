import mongoose, { Schema } from 'mongoose';

const ImageSchema = new Schema({
    name: {
        type:String,
        required: true
    },
    code: {
        type:String,
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
    status: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

export default mongoose.model('Images', ImageSchema);