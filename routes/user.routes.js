import { Router } from "express";
import { loginUser, logoutUser, registerUser, authentication } from "../controllers/user.controller.js";
import { verifyJWT, verifyCookies } from "../middlewares/auth.middleware.js";
import { addPair, fetchWatchlist, updateWatchlist } from "../controllers/watchlist.controller.js";

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

//watchList
router.route("/watchlist").post(updateWatchlist)
router.route("/watchlist/pair").post(addPair)
router.route("/fetchWatchlist").post(fetchWatchlist)

//secured routes
router.route("/logout").post( verifyJWT, logoutUser )
router.route("/authentication").post( verifyCookies, authentication )

export default router;