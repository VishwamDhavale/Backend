import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
app.use(cookieParser())

// Routes import
import userRoute from './routes/user.routes.js';
import videoRoute from './routes/video.routes.js';
import commentRoute from './routes/comment.routes.js';
import likeRoute from './routes/like.routes.js';
import tweetRoute from './routes/tweet.routes.js';
import playlistRoute from './routes/playlist.routes.js';
import subscriptionRoute from './routes/subscription.routes.js';
import healthcheckRoute from './routes/healthcheck.routes.js';


// Routes declaration
app.use('/api/v1/users', userRoute);
app.use('/api/v1/videos', videoRoute);
app.use('/api/v1/comments', commentRoute);
app.use('/api/v1/likes', likeRoute);
app.use('/api/v1/tweets', tweetRoute);
app.use('/api/v1/playlist', playlistRoute);
app.use('/api/v1/subscriptions', subscriptionRoute);
app.use('/api/v1/healthcheck', healthcheckRoute);

// error handling
import ApiError from "./utils/ApiError.js";
app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors,
            data: null
        });
    }

    return res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error",
        errors: [],
        data: null
    });
});

app.get('/', (req, res) => {
    res.send('Hello World');
});

export default app;