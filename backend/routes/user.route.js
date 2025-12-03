import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
    registerUser,
    loginUser,
    logoutUser,
    changeCurrentPassword,
    getLoggedInUserInfo,
    updateUserProfile,
    deleteUser,
    updateUserAvatar
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router()

// *==========================
// *User Routes

// *Register and login routes
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

// *Authenticated user routes
router.route("/password/update-password").put(verifyJWT, changeCurrentPassword)
router.route("/dashboard").get(verifyJWT, getLoggedInUserInfo)
router.route("/update-profile").put(verifyJWT, updateUserProfile)
router.route("/update-avatar").put(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/delete-profile").delete(verifyJWT, deleteUser)
router.route("/logout").get(verifyJWT, logoutUser)


export default router;