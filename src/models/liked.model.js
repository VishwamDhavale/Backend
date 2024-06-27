import mongoose, { Schema } from "mongoose";

const likedSchema = new Schema({
    comment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },
    video: {
        type: Schema.Types.ObjectId,
        ref: 'Video',
        required: true
    },
    likedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',

    },
    tweet: {
        type: Schema.Types.ObjectId,
        ref: 'Tweet',

    }
}, {
    timestamps: true
});

export const Liked = mongoose.model('Liked', likedSchema)