import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { Liked } from "../models/liked.model.js";
import { ApiRespone } from "../utils/ApiRespone.js";
import { isValidObjectId } from "mongoose";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const existingLike = await Liked.findOne({
        video: videoId,
        likedBy: req.user._id
    });

    let isLiked = false;
    if (existingLike) {
        await Liked.findByIdAndDelete(existingLike._id);
        isLiked = false;
    } else {
        await Liked.create({
            video: videoId,
            likedBy: req.user._id
        });
        isLiked = true;
    }

    // Get updated count
    const likesCount = await Liked.countDocuments({ video: videoId });

    return res.status(200).json(
        new ApiRespone(200, isLiked ? "Liked successfully" : "Unliked successfully", { 
            isLiked,
            likesCount 
        })
    );
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    const existingLike = await Liked.findOne({
        comment: commentId,
        likedBy: req.user._id
    });

    if (existingLike) {
        await Liked.findByIdAndDelete(existingLike._id);
        return res.status(200).json(
            new ApiRespone(200, "Comment unliked successfully", { isLiked: false })
        );
    }

    await Liked.create({
        comment: commentId,
        likedBy: req.user._id
    });

    return res.status(200).json(
        new ApiRespone(200, "Comment liked successfully", { isLiked: true })
    );
});

const getLikedVideos = asyncHandler(async (req, res) => {
    const likedVideos = await Liked.find({
        likedBy: req.user._id,
        video: { $exists: true }
    }).populate("video");

    return res.status(200).json(
        new ApiRespone(200, "Liked videos fetched successfully", likedVideos)
    );
});

export {
    toggleVideoLike,
    toggleCommentLike,
    getLikedVideos
};
