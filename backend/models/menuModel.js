import mongoose, { Schema } from 'mongoose';

const MenuElementSchema = new Schema();

MenuElementSchema.add({
    url: String,
    text: String,
    children: [MenuElementSchema]
});

const MenuSchema = new Schema({
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
    elements: [MenuElementSchema],
    status: {
        type: String,
        required: true
    }
});

export default mongoose.model('Menu', MenuSchema);