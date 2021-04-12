import mongoose, { Schema } from 'mongoose';

const RoleSchema = new Schema({
    name: {
        type:String, 
        required: true
    },
    code: {
        type:String, 
        required: true
    },
    description: {
        type:String, 
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date
    },
    status: {
        type: String,
        required: true
    }
});

export default mongoose.model('Roles', RoleSchema);


