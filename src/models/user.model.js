import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    username: {
        Type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true
    },
    fullName: {
        Type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    email: {
        Type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        Type: String,
        required: [true, 'Password is required'],
    },
    avatar: {
        Type: String,
        required: true
    },
    coverImage:
    {
        Type: String
    },
    refreshToken: {
        Type: String,
        trim: true

    },
    watchhistory: {
        type: Schema.Types.ObjectId,
        ref: 'Video'
    }

}, { timestamps: true })

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.passwaord = await bcrypt.hash(this.password, 8);
    next();
})

userSchema.methods.isPasswordMatch = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        username: this.username,
        fullName: this.fullName,
        email: this.email,
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    });
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
    }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    });
}


export const User = mongoose.model('User', userSchema);