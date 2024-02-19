import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        nickname: {
            required: true,
            type: String,
            unique: true,
        },
        email: {
            required: true,
            type: String,
            unique: true,
        },
        passwordHash: {
            required: true,
            type: String,
        },
        followings: {
            type: Array,
            default: [],
        },
        followers: {
            type: Array,
            default: [],
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('User', UserSchema);
