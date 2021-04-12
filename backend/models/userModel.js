import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
    firstName: {
        type:String, 
        required: true
    },
    lastName: {
        type:String, 
        required: true
    },
    email: {
        type:String, 
        required: true
    },
    password: {
        type:String, 
        required: true
    },
    phoneNumber: {
        type:String
    },
    createdAt: {
        type: Date,
        default: new Date
    },
    updatedAt: {
        type: Date,
        default: new Date
    },
    roles: [String],
    status: {
        type: String,
        required: true
    }
});

export default mongoose.model('User', UserSchema);