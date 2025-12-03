import ErrorHandler from "./error.middleware.js";
import { asyncHandler } from "./asyncHandler.middleware.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";


export const verifyJWT = asyncHandler(async (req, res, next) => {
    console.log("\n-------------\nVERFYJWT.js\n-------------\n")
    if (typeof window !== 'undefined') {
            // console.log('we are running on the client')
        } else {
            // console.log('we are running on the server');
            // console.log("req..", req.body)
        }
        // console.log(req.cookies?.accessToken)
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        // console.log("token: (12)", token)

        if (!token) {
            // throw new ApiError(401, "Unauthorized Access");
            // return new ApiError(401, "Unauthorized Access (token) - 16)").toResponse(res);
            // console.error("refreshing token expired")
            return next(new ErrorHandler("Unauthorizes!, token expired", 401))

        }

        try {
            const decodedTokenInformation = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            // console.log("decodedTokenInformation: (19)", decodedTokenInformation)

            const user = await User.findById(decodedTokenInformation?._id).select("-password -refreshToken");
            // console.log("user: (22)", user)

            if (!user) {
                // throw new ApiError(401, "Invalid AccessToken!!");
                // return new ApiError(401, "Invalid AccessToken!!");
                // console.error("refreshing user not found, token expired")
                return next(new ErrorHandler("Invalid AccessToken!!, token expired", 401))
            }

            req.user = user;
            // console.log("req.user: (29)", req.user)

            // **Attach `exp` (expiry time) to response headers**
            // res.locals.tokenExp = decodedTokenInformation.exp; // Store expiry timestamp


            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                // Try to refresh token
                const refreshToken = req.cookies?.refreshToken;
                if (!refreshToken) {
                    return next(new ErrorHandler("Access Token Expired and no refresh token", 401));
                }
                try {
                    const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                    const user = await User.findById(decodedRefresh?._id);
                    if (!user || user.refreshToken !== refreshToken) {
                        return next(new ErrorHandler("Invalid Refresh Token", 401));
                    }
                    // Generate new tokens
                    const newAccessToken = await user.generateAccessToken();
                    const newRefreshToken = await user.generateRefreshToken();
                    user.refreshToken = newRefreshToken;
                    await user.save();

                    const options = {
                        httpOnly: true,
                        secure: true,
                        maxAge: 3 * 24 * 60 * 60 * 1000,
                        sameSite: "None"
                    };

                    res.cookie("accessToken", newAccessToken, options);
                    res.cookie("refreshToken", newRefreshToken, options);

                    // Set req.user with the user
                    req.user = await User.findById(decodedRefresh?._id).select("-password -refreshToken");
                    next();
                } catch (refreshError) {
                    return next(new ErrorHandler("Refresh Token Expired", 401));
                }
            } else {
                return next(new ErrorHandler("Invalid AccessToken!!", 401));
            }
        }
})


export const customRoles = (...roles) => {
    return asyncHandler(async (req, res, next) => {
        if (!roles.includes(req.user?.role)) {
            return next(new ErrorHandler("You are not allowed for this action!!", 403))
        }
        next();
    })
}