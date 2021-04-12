import mongoose, { Schema } from 'mongoose';

const MetaTagSchema = new Schema();
MetaTagSchema.add({
    name: String,
    content: String
});

const StylesSchema = new Schema();
StylesSchema.add({
    property: String,
    value: String
});

const ContentSchema = new Schema();
ContentSchema.add({
    content: String,
    selector: String
});

const PageSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    description: {
        type: String
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
    metaTags: [MetaTagSchema],
    styles: [StylesSchema],
    contents: [ContentSchema]
});

export default mongoose.model('Page', PageSchema);