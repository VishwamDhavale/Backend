import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./src/models/user.model.js";
import { Video } from "./src/models/video.model.js";

dotenv.config({
    path: "./.env"
});

const fixUrls = async () => {
    try {
        console.log("Connecting to database...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB.");

        console.log("Updating User avatars and coverImages...");
        const users = await User.find({
            $or: [
                { avatar: { $regex: /^http:\/\// } },
                { coverImage: { $regex: /^http:\/\// } }
            ]
        });

        for (const user of users) {
            if (user.avatar?.startsWith("http://")) {
                user.avatar = user.avatar.replace("http://", "https://");
            }
            if (user.coverImage?.startsWith("http://")) {
                user.coverImage = user.coverImage.replace("http://", "https://");
            }
            await user.save({ validateBeforeSave: false });
        }
        console.log(`Updated ${users.length} users.`);

        console.log("Updating Video files and thumbnails...");
        const videos = await Video.find({
            $or: [
                { videoFile: { $regex: /^http:\/\// } },
                { thumbnail: { $regex: /^http:\/\// } }
            ]
        });

        for (const video of videos) {
            if (video.videoFile?.startsWith("http://")) {
                video.videoFile = video.videoFile.replace("http://", "https://");
            }
            if (video.thumbnail?.startsWith("http://")) {
                video.thumbnail = video.thumbnail.replace("http://", "https://");
            }
            await video.save({ validateBeforeSave: false });
        }
        console.log(`Updated ${videos.length} videos.`);

        console.log("Migration complete!");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
};

fixUrls();
