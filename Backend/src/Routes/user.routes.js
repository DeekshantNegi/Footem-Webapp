import express from "express";
const router = express.Router();
import {verifyJWT} from "../Middlewares/auth.middleware.js";

//getting controllers
import {
  registerUser,
  loginUser,
  getUserProfile,
  changeUserPassword,
  logoutUser,
} from "../Controllers/user.controllers.js";

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post( verifyJWT, logoutUser);

router.route("/profile").get(getUserProfile);
router.route("/changepassword").put(changeUserPassword);

export default router;
