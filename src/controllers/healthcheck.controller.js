import { ApiRespone } from "../utils/ApiRespone.js";
import asyncHandler from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const healthCheck = asyncHandler(async (req, res) => {
    const dbStatus = mongoose.connection.readyState;
    const states = {
        0: "disconnected",
        1: "connected",
        2: "connecting",
        3: "disconnecting",
        99: "uninitialized"
    };

    const mongoUri = process.env.MONGO_URI || "";
    const maskedUri = mongoUri.replace(/\/\/[^:]+:[^@]+@/, "//***:***@");

    return res.status(200).json(
        new ApiRespone(200, "Health check passed", {
            status: "OK",
            database: {
                state: states[dbStatus] || "unknown",
                uriSet: !!process.env.MONGO_URI,
                maskedUri: maskedUri
            },
            uptime: process.uptime(),
            timestamp: Date.now()
        })
    );
});

export { healthCheck };
