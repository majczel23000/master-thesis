import mongoose, { Schema } from 'mongoose';

const DictionaryElementSchema = new Schema();

DictionaryElementSchema.add({
    language: String,
    elements: [
        {
            value: String
        }
    ]
})

const DictionaryModel = new Schema({
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
    status: {
        type: String,
        required: true
    },
    dictionary: [DictionaryElementSchema]
});

export default mongoose.model('Dictionary', DictionaryModel);