import { Router } from 'express';
import { changeCoverImage, changeCurrentPassword, changeUserAvatar, getCurrentUser, getUserChannelProfile, getWatchHistory, loginUser, logoutUser, registerUser, returnAccesToken, updateAccountDetails } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js'
import { verifyJWT } from '../middlewares/auth.middleware.js';

import { ApiRespone } from '../utils/ApiRespone.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.route("/register").post(
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'coverImage', maxCount: 1 }
    ]),
    registerUser
);

router.route("/login").post(loginUser)

//secure routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(verifyJWT, returnAccesToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)

router.route("/change-avatar").patch(verifyJWT, upload.single('avatar'), changeUserAvatar)

router.route("/cover-image").patch(verifyJWT, upload.single('coverImage'), changeCoverImage)
router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route("/watchhistory").get(verifyJWT, getWatchHistory)


export default router;