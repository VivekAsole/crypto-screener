import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const generateAccessTokenAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        return
    }
}

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({ message: 'User does not exist' });
        }

        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const { accessToken, refreshToken } = await generateAccessTokenAndRefreshTokens(user._id);

        // Cookie options
        const options = {
            httpOnly: true,
            secure: true,
            // sameSite: 'Strict', // Add sameSite option for additional security
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, { ...options, maxAge: 24 * 60 * 60 * 1000 })
            .cookie("refreshToken", refreshToken, { ...options, maxAge: 10 * 24 * 60 * 60 * 1000 })
            .cookie("user",user._id, { ...options, maxAge: 10 * 24 * 60 * 60 * 1000 })
            .json({
                at: accessToken,
                rt: refreshToken,
            });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
})

const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password } = req.body

    // Check if user with the given email already exists
    const existedUser = await User.findOne({ email });

    if (existedUser) {
        console.log('Email already exists');
        return res.status(400).json({
            userCreated: false,
            message: 'Email already exists'
        });
    }

    // Create the user if email does not exist
    try {
        const user = await User.create({
            firstName,
            lastName,
            email,
            password
        });

        return res
            .status(201)
            .json({
                user: user // or select specific fields to return
            });
    } catch (error) {
        return res.status(500).json({
            userCreated: false,
            message: 'Registration failed'
        });
    }
})

const authentication = asyncHandler(async (req, res) => {
    if (req.isTokenVerified) {
        const { accessToken } = req.cookies
        const options = {
            httpOnly: true,
            secure: true,
            // sameSite: 'Strict', // Add sameSite option for additional security
        };
        return res
            .status(201)
            .cookie("accessToken", accessToken, { ...options, maxAge: 24 * 60 * 60 * 1000 })
            .json({
                user: "success",
                at: accessToken
            });
    } else {
        return res
            .status(201)
            .json({
                user: "success"
            })
    }
})

const logoutUser = asyncHandler(async (req, res) => {
    try {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    refreshToken: undefined
                }
            },
        )

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json({
                data: 'user logout done'
            })
    } catch (error) {
        return res
            .status(401)
            .json({ message: 'Error from sever' })
    }
})

export {
    registerUser,
    loginUser,
    authentication,
    logoutUser,
}