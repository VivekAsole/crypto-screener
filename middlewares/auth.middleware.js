import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";


export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "") // from Header, remove Bearer (if present in string) 

        if (!token) {
            // console.log("token not found")
            return res.status(401).json({ message: "Token not found" });
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            // console.log("user not fetch while logout finding")
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user
        next()

    } catch (error) {
        // Handle JWT verification errors and send appropriate response
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token" });
        }
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        }
        // Handle other errors
        // console.error("JWT verification error:", error)
        return res.status(500).json({ message: "Internal server error" });
    }
})

export const verifyCookies = asyncHandler(async (req, res, next) => {
    const { accessToken, refreshToken } = req.cookies
    try {
        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token not found. Please login.' })
        }
        if (accessToken) {
            next()
        } else {
            const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
            
            const user = await User.findById(decodedToken?._id)
            
            if (!user) {
                // console.log("user not fetch while logout finding")
                return res.status(401).json({ message: "User not found" });
            }
            req.user = user
            const accessToken = await user.generateAccessToken()
            req.cookies.accessToken = accessToken            
            req.isTokenVerified = true
            next()
        }
    } catch (error) {
        // Handle JWT verification errors and send appropriate response
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token" });
        }
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        }
        // Handle other errors
        // console.error("JWT verification error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
})