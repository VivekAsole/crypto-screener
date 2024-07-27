import { Router } from "express";
import { loginUser, logoutUser, registerUser, authentication } from "../controllers/user.controller.js";
import { verifyJWT, verifyCookies } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(registerUser)

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post( verifyJWT, logoutUser )
router.route("/authentication").post( verifyCookies, authentication )

export default router;