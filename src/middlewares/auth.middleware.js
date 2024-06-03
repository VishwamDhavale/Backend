import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import jwt from 'jsonwebtoken';
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    //next is uswed to pass control to the next middleware function
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        // console.log("token", token)

        if (!token) {
            throw new ApiError(401, 'Unauthorized');
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const loginUser = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!loginUser) {
            //frontend should redirect to login page

            throw new ApiError(401, 'invalid token');
        }
        req.user = loginUser;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || 'Unauthorized');
    }

});