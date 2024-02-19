import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
    {
        title: {
            required: true,
            type: String,
        },
        text: {
            required: true,
            type: String,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('Post', PostSchema);
