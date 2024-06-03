import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiRespone } from '../utils/ApiRespone.js';
import jwt from 'jsonwebtoken';

const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });// when saving mongoose will validate the fields, we are not updating the fields so we are skipping the validation
        return { accessToken, refreshToken };

    } catch (error) {
        return new ApiError(500, 'Failed to generate tokens');
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const { username, email, password, fullName } = req.body;
    console.log("username", username, "email", email, "password", password, "fullName", fullName)
    // console.log(req.files)
    if (!username || !email || !password || !fullName) {
        throw new ApiError(400, 'Please fill in all fields');
    }
    // if [username, email, password, fullname].some((field) => field.trim() === '') {
    //     throw new ApiError(400, 'Please fill in all fields');
    //}

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]

    })
    if (existedUser) {
        throw new ApiError(409, 'User already exists');
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, 'Please upload an avatar');
    }

    // upload to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(500, 'Failed to upload image');
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new ApiError(500, 'Failed to create user');
    }

    return res.status(201).json(
        new ApiRespone(201, 'User created successfully', createdUser)
    )







});

const loginUser = asyncHandler(async (req, res) => {
    // get user details from frontend email/username and password
    // validation - not empty
    // authenticate user - username, password
    // check if user exists: access token, refresh token
    // generate access token
    // generate refresh token
    // save refresh token in db
    // return res in cookie secure httponly


    const { username, email, password } = req.body;
    // console.log("email", email, "username", username, "password", password)

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }


    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(401, 'No user found');
    }
    if (!password) {
        throw new ApiError(400, 'Please enter password');
    }


    const isMatch = await user.isPasswordMatch(password);

    if (!isMatch) {
        throw new ApiError(401, 'Invalid password');
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

    const loginUser = await User.findById(user._id).select("-password -refreshToken");


    const options = {
        httponly: true,//only for server and not accessible by javascript(frontend)
        secure: true,//only for https
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiRespone(200, 'User logged in successfully', {
            user: loginUser,
            accessToken,
            refreshToken
        }));

});

const logoutUser = asyncHandler(async (req, res) => {
    // remove refresh token from db
    // clear cookies
    // return res
    await User.findByIdAndUpdate(req.user._id, {
        $set: { refreshToken: undefined }
    }, {
        new: true
    });



    const options = {
        httponly: true,//only for server and not accessible by javascript(frontend)
        secure: true,//only for https
    }

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiRespone(200, 'User logged out successfully', {}));
});

const returnAccesToken = asyncHandler(async (req, res) => {
    // get refresh token from cookie
    // check if refresh token exists
    // verify refresh token
    // generate access token
    // return res
    const imcomingrefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!imcomingrefreshToken) {
        throw new ApiError(400, 'No refresh token found');
    }

    try {
        const decodedToken = jwt.verify(imcomingrefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, 'Invalid refresh token');
        }
        if (imcomingrefreshToken !== user.refreshToken) {
            throw new ApiError(401, 'refresh token expired or revoked');
        }

        const { accessToken, newrefreshToken } = await generateAccessTokenAndRefreshToken(user._id);

        const options = {
            httponly: true,//only for server and not accessible by javascript(frontend)
            secure: true,//only for https
        }

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newrefreshToken, options)
            .json(new ApiRespone(200, 'Access token generated', {
                accessToken, refreshToken
            }));
    } catch (error) {
        throw new ApiError(401, error?.message || 'Unauthorized');

    }
});

export {
    registerUser, loginUser,
    logoutUser,
    returnAccesToken
};