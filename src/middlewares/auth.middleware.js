import asyncHandler from "../utils/asyncHandler";
import jwt from 'jsonwebtoken';
import { User } from "../models/user.model";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    //next is uswed to pass control to the next middleware function
    try {
        const token = req.cookies?.accessToken || req.headers['authorization']?.replace('Bearer ', '');

        if (!token) {
            throw new ApiError(401, 'Unauthorized');
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid token' });
            }
        });

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