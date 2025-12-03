import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import ErrorHandler from "../middlewares/error.middleware.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"
import crypto from "crypto"

import { User } from "../models/user.model.js";
import { destroyOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.utils.js";
import mongoose from "mongoose";
import { cookieToken } from "../utils/cookie.utils.js";
import { cloudinaryAvatarRefer } from "../utils/constants.utils.js";
import { logActivity } from "../utils/logActivity.js";

// *================================================================================


// *Refresh-Access Token Route
// !watch out
const refreshAccessToken = asyncHandler(async (req, res, next) => {
    // console.log("Refreshing the accessToken...")
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    // console.log("INCOMING REFRESH TOKEN", incomingRefreshToken)
    if (!incomingRefreshToken) {
        // console.error("(refresh)")
        return next(new ErrorHandler("Unauthorises Request", 401))
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id);
        // console.log("USER FOUND", user)
        if (!user || user.refreshToken !== incomingRefreshToken) {
            // console.error("Invalid or Expired Refresh Token")
            return next(new ErrorHandler("Invalid or Expired Refresh Token", 401))

        }


        // const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id)
        cookieToken(user, res)

    } catch (error) {
        return next(new ErrorHandler(error?.message || "Invalid Refresh Token", 401))
        // throw new ApiError(401, error?.message || "Invalid Refresh Token");
    }
})


// *Register Route
const registerUser = asyncHandler(async (req, res, next) => {


    console.log("SomeOne hitted here")
    const { fullName, email, phone, password } = req.body;
    console.log("fullName : ", fullName, email, password, phone)

    const requiredFields = [fullName, email, phone.toString(), password]

    const checkFields = { email, phone }

    if (requiredFields.some((field) => !field || field.trim() === "")) {
        console.log("All Fields are required")
        return next(new ErrorHandler("All fields are required", 400))
    }
        if (password.length < 8) {
        return next(new ErrorHandler("Password must be at least 8 characters long", 400));
    }

    const existingUser = await User.findOne({
        $or: Object.entries(checkFields).map(([key, value]) => ({ [key]: value }))
    })


    if (existingUser) {
        // console.log("ExistingUser")
        // console.log(existingUser)
        const duplicateField = Object.keys(checkFields).find(key => existingUser[key].toString().toLowerCase() === checkFields[key].toString().toLowerCase())
        // console.log("duplicateFiels:\n", duplicateField, checkFields[duplicateField], existingUser[duplicateField])
        return res.status(400).json({
            success: false,
            message: `User already exist with the same ${duplicateField}: "${checkFields[duplicateField]}"\nPlease try unique one!`,
            duplicateField
        })
        // return next(new ErrorHandler(`User already exist with the same ${duplicateField}: "${checkFields[duplicateField]}"\nPlease try unique one!`, 400))
    }

    try {
        const user = await User.create({
            fullName, email, phone, password, isVerified: true
        })


        await cookieToken(user, res)





    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            console.error("⚠️ Validation Error:", error.message);

            // Optional: get individual field messages
            Object.values(error.errors).forEach(err => {
                console.log(`Field: ${err.path} → ${err.message}`);

                return next(new ErrorHandler(`Field: ${err.path} → ${err.message}`));
            });

        } else {
            console.error("❌ Unknown Error:", error);
            return false;
        }
    }

})

// ! ---take care of passwors -we don't wanna show it in response as the user signUp or login

// *Login Route
const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    console.log(email, password)
    try {
        if (!email || !password) {
            console.error("Login all fields req")
            return next(new ErrorHandler("Please fill in all fields", 400));
        }

        const user = await User.findOne({ email })


        if (!user) {
            return next(new ErrorHandler("Invalid Credentials", 401))
        }

        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            return next(new ErrorHandler("Invalid credentials", 400))
        }

        cookieToken(user, res)
    } catch (error) {
        return next(new ErrorHandler(`Something went wrong..details - ${error.message}`, 500))
    }

})

// *Logout Route
const logoutUser = asyncHandler(async (req, res, next) => {
    try {
        console.log("Logout route hitted")
        const userId = req.user._id
        console.log(userId)

        try {
            const user = await User.findByIdAndUpdate(
                userId,
                {
                    // $set: { isVerified: false },
                    $unset: { refreshToken: "" } // ✅ Removes refreshToken field
                },

                {
                    new: true
                }
            )
            console.log("Suceess logout")
            await logActivity(
                req.user._id,
                "logout",
                `${user?.fullName} logged-out from excel-analytics-platform: `,
                req
            );
        } catch (error) {
            console.error("Unable to logout USer:\n", error)
        }

        const options = {
            httpOnly: true,
            secure: true
        }


        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json({
                success: true,
                message: "User Logged Out Successfully!",
            })
    } catch (error) {
        console.error("Logout Error:\n", error)
        return next(new ErrorHandler(`Error logout session :\n${error}`, 400))
    }
})

// *Change Password ---
// !--check for the minimum lenght before save
const changeCurrentPassword = asyncHandler(async (req, res, next) => {

    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
        return next(new ErrorHandler("All fields are required", 400));
    }

    if (newPassword.length < 8) {
        return next(new ErrorHandler("Password must be at least 8 characters long", 400));
    }


    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);



    if (!isPasswordCorrect) {
        // throw new ApiError(401, "");
        return next(new ErrorHandler("Invalid old password", 401))
    }

    if (newPassword !== confirmPassword) {
        return next(new ErrorHandler("Confirm Password dindn't match the new Password!", 401))
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
    await logActivity(
        req.user._id,
        "change-password",
        `${user?.fullName} changed password`,
        req
    );

    return res.status(200).json({
        success: true,
        message: "Password update Successfully!"
    })
})



// *Update Profile User
const updateUserProfile = asyncHandler(async (req, res, next) => {
    const userId = req.user?._id
    const { fullName, email, phone, gender, social_links = {} } = req.body
    console.log("req.body[registerUser]:\n", req.body)

    const requiredFields = [email, phone]
    // console.log("requiredFields", requiredFields)

    const checkFields = { email, phone }
    // console.log("Check Fields", checkFields)

    // *Required Fields_____________________________________________
    if (!fullName || !email || !phone) {
        console.error("emptyError")
        return next(new ErrorHandler("All Fields are required", 400))
    }


    // *Check for an existing User__________________________________________________
    const existingUser = await User.findOne({
        _id: { $ne: userId }, // Exclude the current user
        $or: Object.entries(checkFields).map(([key, value]) => ({ [key]: value }))
    })

    if (existingUser) {
        const duplicateField = Object.keys(checkFields).find(key => existingUser[key].toString().toLowerCase() === checkFields[key].toString().toLowerCase())
        // console.log("duplicateFiels:\n", duplicateField, checkFields[duplicateField], existingUser[duplicateField])
        return res.status(400).json({
            success: false,
            message: `User already exist with the same ${duplicateField}: "${checkFields[duplicateField]}"\nPlease try unique one!`,
            duplicateField
        })
        // return next(new ErrorHandler(`User already exist with the same ${duplicateField}: "${checkFields[duplicateField]}"\nPlease try unique one!`, 400))
    }

    try {
        Object.entries(social_links).forEach(([platform, url]) => {
            if (url) {
                try {
                    // Ensure URL is valid
                    const parsed = new URL(url);

                    // 1. Protocol must be HTTPS
                    if (parsed.protocol !== "https:") {
                        throw new Error(`${platform} link must start with https://`);
                    }

                    // 2. Hostname must contain platform domain (except for website)
                    if (platform !== "website" && !parsed.hostname.includes(`${platform}.com`)) {
                        throw new Error(`${platform} link must be a valid ${platform}.com domain`);
                    }

                } catch (e) {
                    throw new Error(`${platform} link is invalid. Please enter a valid full https link.`);
                }
            }
        });

    } catch (error) {
        console.log(error)
        return res.status(403).json({
            error: "You must provide full links with http(s) included"
        });
    }




    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { fullName, email, phone, gender, social_links },
        { new: true, runValidators: true }
    ).select("-password -refreshToken");

    if (!updatedUser) {
        return next(new ErrorHandler("User not found", 404));
    }
    await logActivity(
        req.user._id,
        "update-profile",
        ` ${updatedUser?.fullName} updated profile`,
        req
    );

    return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: updatedUser
    });



})


// *Update Profile User
const updateUserAvatar = asyncHandler(async (req, res, next) => {
    console.log("reques.files: ", req.file)
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        console.log("AVATAR")
        return next(new ErrorHandler("Avatar File is Missing", 404))
    }

    const user = await User.findById(req?.user?._id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    // *Delete the previous file
    // ----------------------------------------------------------------
    const previousAvatar = user.avatar?.public_id;
    console.log("previousAvatar", previousAvatar)

    if (previousAvatar) {
        const deleteAvatarResponse = await destroyOnCloudinary(previousAvatar, cloudinaryAvatarRefer);
        console.log("deletedAvatarr:response--", deleteAvatarResponse);
    } else {
        console.log("No previous avatr found")
    }
    // ----------------------------------------------------------------


    // *UPLOADING NEW AVATAR

    const newAvatar = await uploadOnCloudinary(avatarLocalPath, cloudinaryAvatarRefer, req?.user, req?.file?.originalname);
    console.log("Previous URL: ", newAvatar)

    if (!newAvatar || !newAvatar.url || !newAvatar.public_id) {
        return next(new ErrorHandler("Error while uploading avatar!", 500));
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    "avatar.public_id": newAvatar.public_id,
                    "avatar.secure_url": newAvatar.secure_url,
                },
            },
            { new: true }
        ).select("-password")


        console.log("NEW URL: ", newAvatar);
        console.log("NEW URL: ", updatedUser.avatar);
        console.log("Updated User Avatar URL:", updatedUser.avatar.secure_url);

        await logActivity(
            req.user._id,
            "avatar",
            `${updatedUser?.fullName} updated avatar `,
            req
        );
        return res
            .status(200)
            .json({
                success: true,
                user: updatedUser,
                message: "Avatar Updated Successfully!"
            })
    } catch (error) {
        console.error("error", error)
        const deleteAvatarResponse = await destroyOnCloudinary(newAvatar?.public_id, cloudinaryAvatarRefer);
        console.log("deleteAvatarResponse", deleteAvatarResponse);
        return next(new ErrorHandler(`Unable to update user profle\n ${error}`, 401))
    }
})

// *User DashBoard - just getting the loggedIn Info of user
const getLoggedInUserInfo = asyncHandler(async (req, res, next) => {
    console.log("Over here")
    const user = await User.findById(req.user._id).select("-password -refreshToken")

    console.log("USers thre")
    res.status(200).json({
        success: true,
        user
    })
})

// *Delete User
const deleteUser = asyncHandler(async (req, res, next) => {
    try {
        const userId = req.user?._id;

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return next(new ErrorHandler("User Not Found", 404))

        }

        // Delete the user
        await User.findByIdAndDelete(userId);

        await logActivity(
            req.user._id,
            "delete-user",
            `${user?.fullName} delete himself `,
            req
        );
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        return next(new ErrorHandler("Internal Server Error", 500))
    }
});


export {
    refreshAccessToken,
    registerUser,
    loginUser,
    logoutUser,
    getLoggedInUserInfo,
    changeCurrentPassword,
    updateUserProfile,
    updateUserAvatar,
    deleteUser,
}